package main

import (
	"errors"
	"net/http"

	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Data structures
type todo struct {
	ID          int    `json:"id"`
	FirstName   string `json:"firstname"`
	LastName    string `json:"lastname"`
	Email       string `json:"email"`
	Address     string `json:"address"`
	PhoneNumber string `json:"phonenumber"`
}

var todos = []todo{}

// ======================================================
// Read
// ======================================================
func getTodos(context *gin.Context) {
	context.IndentedJSON(http.StatusOK, todos)
}

func getTodo(context *gin.Context) {
	id := context.Param("id")
	todo, err := getItemByID(id)

	if err != nil {
		context.IndentedJSON(http.StatusNotFound, gin.H{"message": "Record not found"})
		return
	}

	context.IndentedJSON(http.StatusOK, todo)
}

func getItemByID(id string) (*todo, error) {
	for i, t := range todos {
		if strconv.Itoa(t.ID) == id {
			return &todos[i], nil
		}
	}

	return nil, errors.New("todo not found")
}

// ======================================================

// ======================================================
// Create
// ======================================================
func addTodo(context *gin.Context) {
	var newTodo todo

	if err := context.BindJSON(&newTodo); err != nil {
		return
	}

	lastID := getLastID()
	newTodo.ID = lastID + 1

	todos = append(todos, newTodo)

	context.IndentedJSON(http.StatusCreated, newTodo)
}

func getLastID() int {
	if len(todos) == 0 {
		return 0
	}

	return todos[len(todos)-1].ID
}

// ======================================================

// ======================================================
// Update
// ======================================================
func toggleTodoStatus(context *gin.Context) {
	id := context.Param("id")
	var newTodo todo

	if err := context.BindJSON(&newTodo); err != nil {
		return
	}

	for index, item := range todos {
		if strconv.Itoa(item.ID) == id {
			todos[index] = newTodo
		}
	}

	context.IndentedJSON(http.StatusOK, todos)
}

// ======================================================

// ======================================================
// Delete
// ======================================================

func deleteItem(context *gin.Context) {
	id := context.Param("id")
	_, err := getItemByID(id)

	if err != nil {
		context.IndentedJSON(http.StatusNotFound, gin.H{"message": "Record not found"})
		return
	}

	newArray := []todo{}

	newLength := 0
	for index, item := range todos {
		if id != strconv.Itoa(item.ID) {
			newArray = append(newArray, todos[index])
			newLength++
		}
	}

	todos = newArray
	context.IndentedJSON(http.StatusOK, gin.H{"message": "Successfully Deleted"})
}

// ======================================================
func main() {
	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/todos", getTodos)
	router.GET("/todos/:id", getTodo)
	router.PUT("/todos/:id", toggleTodoStatus)
	router.POST("/todos", addTodo)
	router.DELETE("/delete/:id", deleteItem)
	router.Run("localhost:9090")
}
