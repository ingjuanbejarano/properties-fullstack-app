using Microsoft.EntityFrameworkCore;
using properties_app_backend.Data;
using properties_app_backend.Entities;

namespace properties_app_backend.Repositories;

public class PropertyRepository : IPropertyRepository
{
	private readonly ApplicationDbContext _context;

	public PropertyRepository(ApplicationDbContext context)
	{
		_context = context;
	}

	public async Task<IEnumerable<Property>> GetAllAsync()
	{
		return await _context.Properties.ToListAsync();
	}

	public async Task<IEnumerable<Property>> GetAllWithFiltersAsync(string? name = null, string? address = null, decimal? minPrice = null, decimal? maxPrice = null)
	{
		// Start with the base query - this creates the expression tree
		IQueryable<Property> query = _context.Properties;

		// Build the expression tree with filters BEFORE executing
		if (!string.IsNullOrWhiteSpace(name))
		{
			query = query.Where(p => p.Name.Contains(name));
		}

		if (!string.IsNullOrWhiteSpace(address))
		{
			query = query.Where(p => p.Address.Contains(address));
		}

		if (minPrice.HasValue)
		{
			query = query.Where(p => p.Price >= minPrice.Value);
		}

		if (maxPrice.HasValue)
		{
			query = query.Where(p => p.Price <= maxPrice.Value);
		}

		// NOW execute the query with all filters applied at database level
		return await query.ToListAsync();
	}

	public async Task<Property?> GetByIdAsync(string id)
	{
		return await _context.Properties.FindAsync(id);
	}

	public async Task<Property> AddAsync(Property entity)
	{
		_context.Properties.Add(entity);
		await _context.SaveChangesAsync();
		return entity;
	}

	public async Task<Property> UpdateAsync(Property entity)
	{
		_context.Properties.Update(entity);
		await _context.SaveChangesAsync();
		return entity;
	}

	public async Task<bool> DeleteAsync(string id)
	{
		var entity = await GetByIdAsync(id);
		if (entity == null)
			return false;

		_context.Properties.Remove(entity);
		await _context.SaveChangesAsync();
		return true;
	}
}