export type LectureStatus = "completed" | "processing" | "failed";

export interface LectureRecord {
  id: string;
  name: string;
  date: string;
  status: LectureStatus;
}

export const mockHistory: LectureRecord[] = [
  { id: "1", name: "Data Structures — Lecture 07.mp4", date: "2026-07-24", status: "completed" },
  { id: "2", name: "Organic Chemistry — Alkenes.mp3", date: "2026-07-21", status: "completed" },
  { id: "3", name: "Linear Algebra — Eigenvalues.wav", date: "2026-07-18", status: "processing" },
  { id: "4", name: "Microeconomics — Elasticity.mp3", date: "2026-07-12", status: "completed" },
  { id: "5", name: "Islamic History — Abbasid Era.mp4", date: "2026-07-05", status: "failed" },
];

export const mockSummary = `This lecture introduced the core principles of hash-based data structures and their role in achieving average constant-time lookups. The instructor compared arrays, linked lists, and hash tables, then walked through collision handling strategies — separate chaining and open addressing — with worked examples on the board.

The final third of the session focused on load factor, dynamic resizing, and why a good hash function matters far more than table size. Students were reminded that the upcoming midterm will include a written trace of an insertion sequence.`;

export const mockKeyPoints: string[] = [
  "Hash tables trade memory for speed, offering O(1) average lookup time.",
  "Separate chaining stores collisions in linked buckets; open addressing probes for the next free slot.",
  "Load factor above 0.75 typically triggers a resize and full rehash.",
  "A uniform hash function minimises clustering more effectively than simply enlarging the table.",
  "Worst-case performance degrades to O(n) when every key collides.",
];

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export const mockQuiz: QuizQuestion[] = [
  {
    question: "What is the average time complexity of a hash table lookup?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    answer: 2,
  },
  {
    question: "Which strategy stores colliding keys in a linked list per bucket?",
    options: ["Open addressing", "Separate chaining", "Linear probing", "Cuckoo hashing"],
    answer: 1,
  },
  {
    question: "What usually happens when the load factor exceeds 0.75?",
    options: ["Keys are deleted", "The table is resized and rehashed", "Lookups become O(1)", "Nothing"],
    answer: 1,
  },
];

export interface Flashcard {
  front: string;
  back: string;
}

export const mockFlashcards: Flashcard[] = [
  { front: "Load factor", back: "The ratio of stored entries to available buckets in a hash table." },
  { front: "Collision", back: "Two distinct keys hashing to the same bucket index." },
  { front: "Open addressing", back: "Resolving collisions by probing for the next free slot in the table." },
  { front: "Rehashing", back: "Rebuilding the table with a larger capacity and re-inserting every key." },
];
