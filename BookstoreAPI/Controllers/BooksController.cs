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
    /// <param name="category">Optional category name; omit or "All" for every category</param>
    [HttpGet]
    public async Task<ActionResult<BooksResponse>> GetBooks(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 5,
        [FromQuery] string sortBy = "title",
        [FromQuery] string? category = null)
    {
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 5;

        var query = _context.Books.AsQueryable();

        // Filter by category when provided (not "All")
        if (!string.IsNullOrWhiteSpace(category) &&
            !string.Equals(category.Trim(), "All", StringComparison.OrdinalIgnoreCase))
        {
            var cat = category.Trim();
            query = query.Where(b => b.Category == cat);
        }

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

    /// <summary>
    /// Gets distinct book categories for filtering UI.
    /// </summary>
    [HttpGet("categories")]
    public async Task<ActionResult<List<string>>> GetCategories()
    {
        var categories = await _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
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
