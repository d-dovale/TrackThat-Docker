from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

auth_scheme = OAuth2PasswordBearer("auth/login") # To avoid circular import

# EXTRACT THIS TO ENV.
SECRET_KEY = "0bff56c7b85f5df372caaddbded53979155d91485f4d2762469a28234c535e69"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 31 # I month

from typing import Annotated
from sqlmodel import select, col
from fastapi import APIRouter, Body, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from ..dependencies import SessionDep, get_current_user_id
from passlib.context import CryptContext 
from app.models import User, UserBase
from datetime import timedelta, timezone, datetime
import jwt


router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)

class UserInSignUp(BaseModel):
    name : str
    email : EmailStr
    password : str

class UserPatch(UserInSignUp):
    name : str = None
    email : EmailStr = None
    password : str
    new_password : str = None

class UserInLogin(BaseModel):
    email : EmailStr
    password : str

class Goal(BaseModel):
    weekly_goal : int

class Token(BaseModel):
    access_token: str
    token_type: str

class EmailToken(Token):
    username : str
    email : str
    weekly_goal : int

class PatchResponse(BaseModel):
    username : str
    email : str
    weekly_goal : int



pwd_context = CryptContext(schemes=['bcrypt'], deprecated="auto")

def verify_password(plain_password : str, hash_password : str):
     return pwd_context.verify(plain_password, hash_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta # expires in time delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15) # expires in 15 mins by default
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/signup")
async def signup(user : Annotated[UserInSignUp, Body()], session : SessionDep) -> UserBase:
    user_find = session.exec(select(User).where(col(User.email) == user.email)).first()
    if user_find:
       raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with email already exists.",
            )
    if len(user.password) < 5:
       raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Passwords must be at least 5 characters in length.",
            )

    newuser = User(name = user.name, email=user.email, password=get_password_hash(user.password), weekly_goal=0)
    session.add(newuser)
    session.commit()
    session.refresh(newuser)
    return newuser

@router.post("/login") # Need fix, username not unique! Currently not using endpoint in Frontend.
async def login_for_access_token(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session : SessionDep
) -> Token:
    user = session.exec(select(User).where(col(User.name) == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
            data={"sub": f"{user.id}:{user.name}"}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer") 

@router.post("/login-email")
async def login_email(request_user : Annotated[UserInLogin, Body()], session : SessionDep):
    user = session.exec(select(User).where(col(User.email) == request_user.email)).first()
    if not user or not verify_password(request_user.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
            data={"sub": f"{user.id}:{user.name}"}, expires_delta=access_token_expires
    )
    return EmailToken(access_token=access_token, token_type="bearer", username=user.name, email=user.email, weekly_goal=user.weekly_goal) 

@router.post("/set-goal")
async def set_goal(goal : Annotated[Goal, Body()] , user_id : Annotated[int, Depends(get_current_user_id)], session : SessionDep):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User provided does not exist.")
    user.weekly_goal = goal.weekly_goal
    session.add(user)
    session.commit()

@router.post("/patch-user")
async def patch_user(patch_user : Annotated[UserPatch, Body()], user_id : Annotated[int, Depends(get_current_user_id)], session : SessionDep):

    user = session.get(User, user_id)

    if not user or not verify_password(patch_user.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if patch_user.email != None and user.email != patch_user.email:
        user_find = session.exec(select(User).where(col(User.email) == patch_user.email)).first()

        if user_find and user_find != user:
            raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="User with email already exists.",
                    )

        user.email = patch_user.email

    if patch_user.name != None and patch_user.name != user.name:
        user.name = patch_user.name
    
    if patch_user.new_password != None and len(patch_user.new_password) < 5: 
       raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Passwords must be at least 5 characters in length.",
            )

    if patch_user.new_password != None: 
        user.password = get_password_hash(patch_user.new_password)
    
    session.add(user)
    session.commit()
    session.refresh(user)

    return PatchResponse(username=user.name, email=user.email, weekly_goal=user.weekly_goal) 