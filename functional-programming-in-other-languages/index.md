# Functional Programming in Other Languages

This lecture explores functional programming concepts across different programming languages.

> "The principles of functional programming are universal: map, filter, reduce, and monadic patterns appear in every language because they represent fundamental truths about computation, not language-specific tricks." - AI Insight

## Haskell

### Pure Functions
```haskell
-- Pure function with type annotation
add :: Int -> Int -> Int
add x y = x + y

-- Pattern matching
factorial :: Integer -> Integer
factorial 0 = 1
factorial n = n * factorial (n - 1)

-- List comprehension
squares :: [Int] -> [Int]
squares xs = [x^2 | x <- xs, x > 0]
```

### Higher-Order Functions
```haskell
-- Map function
map :: (a -> b) -> [a] -> [b]
map _ [] = []
map f (x:xs) = f x : map f xs

-- Filter function
filter :: (a -> Bool) -> [a] -> [a]
filter _ [] = []
filter p (x:xs)
  | p x = x : filter p xs
  | otherwise = filter p xs

-- Fold function
foldr :: (a -> b -> b) -> b -> [a] -> b
foldr _ z [] = z
foldr f z (x:xs) = f x (foldr f z xs)
```

### Maybe Monad
```haskell
-- Maybe type
data Maybe a = Nothing | Just a

-- Safe division
safeDivide :: Double -> Double -> Maybe Double
safeDivide _ 0 = Nothing
safeDivide x y = Just (x / y)

-- Using Maybe in practice
processDivision :: Double -> Double -> String
processDivision x y = case safeDivide x y of
  Nothing -> "Division by zero"
  Just result -> "Result: " ++ show result
```

## Clojure

### Immutable Data Structures
```clojure
;; Immutable vectors
(def numbers [1 2 3 4 5])
(def doubled (map #(* 2 %) numbers))

;; Immutable maps
(def user {:name "Alice" :age 25})
(def updated-user (assoc user :age 26))

;; Persistent data structures
(def list1 '(1 2 3))
(def list2 (conj list1 4))
;; list1 is unchanged: (1 2 3)
;; list2 is: (4 1 2 3)
```

### Pure Functions
```clojure
;; Pure function
(defn add [x y]
  (+ x y))

;; Higher-order function
(defn apply-twice [f x]
  (f (f x)))

;; Composition
(defn process-data [data]
  (-> data
      (filter pos?)
      (map #(* 2 %))
      (reduce +)))
```

### Lazy Sequences
```clojure
;; Infinite sequence
(def naturals (iterate inc 0))

;; Lazy evaluation
(def first-ten (take 10 naturals))

;; Infinite Fibonacci
(defn fib-seq []
  (letfn [(fib [a b]
            (lazy-seq (cons a (fib b (+ a b)))))]
    (fib 0 1)))
```

## Scala

### Functional Features
```scala
// Pure functions
def add(x: Int, y: Int): Int = x + y

// Pattern matching
def factorial(n: Int): Int = n match {
  case 0 => 1
  case n => n * factorial(n - 1)
}

// Higher-order functions
def map[A, B](f: A => B)(xs: List[A]): List[B] = xs match {
  case Nil => Nil
  case x :: xs => f(x) :: map(f)(xs)
}

// Option type (similar to Maybe)
def safeDivide(x: Double, y: Double): Option[Double] = 
  if (y == 0) None else Some(x / y)
```

### Immutable Collections
```scala
// Immutable list
val numbers = List(1, 2, 3, 4, 5)
val doubled = numbers.map(_ * 2)

// Immutable map
val user = Map("name" -> "Alice", "age" -> 25)
val updatedUser = user + ("age" -> 26)

// For comprehensions
val result = for {
  x <- numbers if x > 2
  y <- List(1, 2)
} yield x * y
```

## F#

### Functional Programming
```fsharp
// Pure functions
let add x y = x + y

// Pattern matching
let rec factorial n =
    match n with
    | 0 -> 1
    | n -> n * factorial (n - 1)

// Pipeline operator
let processData data =
    data
    |> List.filter (fun x -> x > 0)
    |> List.map (fun x -> x * 2)
    |> List.sum

// Option type
let safeDivide x y =
    if y = 0.0 then None
    else Some (x / y)
```

### Discriminated Unions
```fsharp
type Shape =
    | Circle of float
    | Rectangle of float * float
    | Triangle of float * float * float

let area shape =
    match shape with
    | Circle r -> System.Math.PI * r * r
    | Rectangle (w, h) -> w * h
    | Triangle (a, b, c) -> 
        let s = (a + b + c) / 2.0
        sqrt (s * (s - a) * (s - b) * (s - c))
```

## Elm

### Pure Functions and Immutability
```elm
-- Pure functions
add : Int -> Int -> Int
add x y = x + y

-- Immutable records
type alias User =
    { name : String
    , age : Int
    }

updateAge : User -> Int -> User
updateAge user newAge =
    { user | age = newAge }

-- Pattern matching
factorial : Int -> Int
factorial n =
    case n of
        0 -> 1
        n -> n * factorial (n - 1)
```

### Maybe Type
```elm
-- Maybe type
type Maybe a
    = Just a
    | Nothing

-- Safe division
safeDivide : Float -> Float -> Maybe Float
safeDivide x y =
    if y == 0 then
        Nothing
    else
        Just (x / y)

-- Using Maybe
processDivision : Float -> Float -> String
processDivision x y =
    case safeDivide x y of
        Just result ->
            "Result: " ++ String.fromFloat result
        Nothing ->
            "Division by zero"
```

## Common Patterns Across Languages

### Map, Filter, Reduce
```typescript
// TypeScript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
const evens = numbers.filter(x => x % 2 === 0);
const sum = numbers.reduce((acc, x) => acc + x, 0);
```

```haskell
-- Haskell
numbers = [1, 2, 3, 4, 5]
doubled = map (*2) numbers
evens = filter even numbers
sum = foldr (+) 0 numbers
```

```clojure
;; Clojure
(def numbers [1 2 3 4 5])
(def doubled (map #(* 2 %) numbers))
(def evens (filter even? numbers))
(def sum (reduce + numbers))
```

### Monadic Operations
```typescript
// TypeScript with Maybe
const result = Maybe.just(10)
  .bind(x => safeDivide(x, 2))
  .map(x => x * 3)
  .getOrElse(0);
```

```haskell
-- Haskell with Maybe
result = Just 10 >>= \x -> safeDivide x 2 >>= \y -> return (y * 3)
```

```scala
// Scala with Option
val result = Some(10)
  .flatMap(x => safeDivide(x, 2))
  .map(_ * 3)
  .getOrElse(0)
```

## Exercise
Implement a simple calculator in three different functional programming languages, focusing on error handling with Maybe/Option types.

## Resources
- [Haskell Programming](https://www.haskell.org/)
- [Clojure Documentation](https://clojure.org/)
- [Scala Documentation](https://scala-lang.org/)
- [F# Documentation](https://fsharp.org/)
- [Elm Documentation](https://elm-lang.org/)

