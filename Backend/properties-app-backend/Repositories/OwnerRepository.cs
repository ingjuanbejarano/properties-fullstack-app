using Microsoft.EntityFrameworkCore;
using properties_app_backend.Data;
using properties_app_backend.Entities;

namespace properties_app_backend.Repositories;

public class OwnerRepository : IOwnerRepository
{
	private readonly ApplicationDbContext _context;

	public OwnerRepository(ApplicationDbContext context)
	{
		_context = context;
	}

	public async Task<IEnumerable<Owner>> GetAllAsync()
	{
		return await _context.Owners.ToListAsync();
	}

	public async Task<Owner?> GetByIdAsync(string id)
	{
		var owner = await _context.Owners.FirstOrDefaultAsync(o => o.IdOwner == id);
		if (owner != null)
		{
			owner.Properties = await _context.Properties
				.Where(p => p.IdOwner == id)
				.ToListAsync();
		}
		return owner;
	}

	public async Task<Owner> AddAsync(Owner entity)
	{
		_context.Owners.Add(entity);
		await _context.SaveChangesAsync();
		return entity;
	}

	public async Task<Owner> UpdateAsync(Owner entity)
	{
		_context.Owners.Update(entity);
		await _context.SaveChangesAsync();
		return entity;
	}

	public async Task<bool> DeleteAsync(string id)
	{
		var entity = await GetByIdAsync(id);
		if (entity == null)
			return false;

		_context.Owners.Remove(entity);
		await _context.SaveChangesAsync();
		return true;
	}
}