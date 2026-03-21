using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookstoreAPI.Data;
using BookstoreAPI.Models;

namespace BookstoreAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _context;

    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Gets paginated list of books with optional sorting.
    /// </summary>
    /// <param name="pageNumber">1-based page number</param>
    /// <param name="pageSize">Number of results per page (default 5)</param>
    /// <param name="sortBy">Sort order: "title" for ascending, "title_desc" for descending</param>
    [HttpGet]
    public async Task<ActionResult<BooksResponse>> GetBooks(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 5,
        [FromQuery] string sortBy = "title")
    {
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 5;

        var query = _context.Books.AsQueryable();

        // Apply sorting by book title
        query = sortBy.ToLower() switch
        {
            "title_desc" => query.OrderByDescending(b => b.Title),
            _ => query.OrderBy(b => b.Title)
        };

        var totalCount = await query.CountAsync();
        var books = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return Ok(new BooksResponse
        {
            Books = books,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages
        });
    }
}

/// <summary>
/// Response model for paginated books.
/// </summary>
public class BooksResponse
{
    public List<Book> Books { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
