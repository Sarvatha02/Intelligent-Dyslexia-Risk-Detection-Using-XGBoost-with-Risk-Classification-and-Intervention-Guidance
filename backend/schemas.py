from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserSignup(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class StudentProfile(BaseModel):
    name: str
    age: int
    grade: str

class AssessmentData(BaseModel):
    student_id: str
    age: int
    reading_speed: Optional[float] = 100.0
    reading_accuracy: Optional[float] = 100.0
    spelling_score: Optional[float] = 100.0
    phonological_score: Optional[float] = 0.0
    memory_score: Optional[float] = 0.0
    confusion_score: Optional[float] = 0.0
    writing_error_rate: Optional[float] = 0.0
    response_time_variance: Optional[float] = 0.0
    ran_speed_score: Optional[float] = 0.0
    eye_tracking_score: Optional[float] = 0.0
    blink_count: Optional[int] = 0
    tilt_variance: Optional[float] = 0.0
    gaze_variance_x: Optional[float] = 0.0
    gaze_variance_y: Optional[float] = 0.0

class AssessmentResponse(BaseModel):
    risk_level: int
    confidence: float
    label: str
    recommendations: List[str]

class TestHistoryItem(BaseModel):
    id: str
    student_id: str
    risk_level: int
    confidence: float
    created_at: datetime
    reading_speed: float
    reading_accuracy: float

class MCQQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str
    hint: Optional[str] = None

class VisualQuestion(BaseModel):
    type: str
    question: str
    target: Optional[str] = None
    options: List[str]
    answer: str



class TraceShape(BaseModel):
    id: str
    label: str
    points: List[List[float]] # List of [x, y] coordinates

class SequenceItem(BaseModel):
    id: str
    image: str
    order: int

class SequencingMission(BaseModel):
    title: str
    items: List[SequenceItem]

class MemoryWord(BaseModel):
    word: str
    emoji: Optional[str] = ""

class TraceShadow(BaseModel):
    target: str
    shadow: Optional[str] = None
    options: Optional[List[str]] = []

class DirectionSequence(BaseModel):
    sequence: List[str]

class PhonicMatch(BaseModel):
    letter: str
    images: List[str]
    answer: str

class AssessmentContent(BaseModel):
    is_early: bool
    passage: Optional[str] = None
    tracing: List[TraceShape]
    sequencing: List[SequencingMission]
    trace_match: Optional[List[TraceShadow]] = []
    directionality: Optional[List[DirectionSequence]] = []
    letter_img: Optional[List[PhonicMatch]] = []
    phonic_replacement: Optional[List[MCQQuestion]] = []
    early_reading_alt: Optional[List[MCQQuestion]] = []
    # Legacy fields
    spelling: Optional[List[MCQQuestion]] = []
    phonological: Optional[List[MCQQuestion]] = []
    confusion: Optional[List[MCQQuestion]] = []
    memory: Optional[List[MemoryWord]] = []
    visual: Optional[List[VisualQuestion]] = []
    directionality_legacy: Optional[List[MCQQuestion]] = []
    sound_blending: Optional[List[MCQQuestion]] = []
