# Hilton's Bookstore - Mission 11

An online bookstore web app built with ASP.NET Core API and React. Displays books from a SQLite database with pagination, sorting, and Bootstrap styling.

## Requirements

- .NET 10 SDK
- Node.js and npm

## Running the Application

### 1. Start the API

```bash
cd BookstoreAPI
dotnet run --launch-profile http
```

The API runs at http://localhost:5094

### 2. Start the React Client

In a new terminal:

```bash
cd client
npm install
npm run dev
```

The React app runs at http://localhost:5173

### 3. Use the App

- Browse books in the paginated table
- Change "Results per page" (5, 10, 15, 20, or 50)
- Sort by title using the "A → Z" / "Z → A" button
- Navigate pages using the pagination links

## Project Structure

- **BookstoreAPI/** - ASP.NET Core Web API with Entity Framework Core and SQLite
- **client/** - React + TypeScript frontend with Vite and Bootstrap

## Rubric Compliance

- **Program Runs Without Error**: Compiles and runs without error
- **Models Match Database**: Book model matches Books table (BookID, Title, Author, Publisher, ISBN, Classification, Category, PageCount, Price)
- **App Lists Books**: Displays all books from the database
- **Dynamic Pagination**: Pagination links built dynamically based on total book count
- **Sort by Book Title**: A → Z / Z → A toggle
- **Bootstrap Styling**: Tables, buttons, pagination, and layout use Bootstrap
- **Clean Code**: Clear variable names, comments, and structure
