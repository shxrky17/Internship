package main

import "fmt"

// A simple function that adds two numbers
func add(a int, b int) int {
    return a + b
}

func main() {
    // Printing text
    fmt.Println("Hello, Go!")

    // Variables
    var name string = "Yash"
    age := 25 // short declaration
    fmt.Println("Name:", name, "Age:", age)

    // Loop
    fmt.Println("Counting from 1 to 5:")
    for i := 1; i <= 5; i++ {
        fmt.Println(i)
    }

    // Using function
    sum := add(10, 20)
    fmt.Println("10 + 20 =", sum)

    // Conditional
    if age >= 18 {
        fmt.Println(name, "is an adult.")
    } else {
        fmt.Println(name, "is a minor.")
    }
}