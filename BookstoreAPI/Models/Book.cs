using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookstoreAPI.Models;

/// <summary>
/// Represents a book in the bookstore database.
/// </summary>
public class Book
{
    [Key]
    public int BookID { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Author { get; set; } = string.Empty;

    [Required]
    public string Publisher { get; set; } = string.Empty;

    [Required]
    public string ISBN { get; set; } = string.Empty;

    [Required]
    public string Classification { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public int PageCount { get; set; }

    [Required]
    public decimal Price { get; set; }
}
