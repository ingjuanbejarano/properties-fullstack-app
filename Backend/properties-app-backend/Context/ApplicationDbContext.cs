using Microsoft.EntityFrameworkCore;
using MongoDB.EntityFrameworkCore.Extensions;
using MongoDB.Bson;
using properties_app_backend.Entities;

namespace properties_app_backend.Context;

public class ApplicationDbContext : DbContext
{
	public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
	{
	}

	public DbSet<Owner> Owners { get; set; }
	public DbSet<Property> Properties { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		// Configure Owner: collection and relationships
		modelBuilder.Entity<Owner>()
			.ToCollection("owners")            // Configure MongoDB collection
			.HasMany(o => o.Properties)        // Owner can have many Properties
			.WithOne(p => p.Owner)             // Property has one Owner
			.HasForeignKey(p => p.IdOwner)     // Foreign key is IdOwner
			.IsRequired();                     // Relationship is required

		// Configure Property: collection only
		modelBuilder.Entity<Property>()
			.ToCollection("properties");       // Configure MongoDB collection
	}

	// Public method to seed data (called from Program.cs in development)
	public async Task SeedDevelopmentDataAsync()
	{
		// Check if data already exists
		if (Owners.Any() || Properties.Any())
		{
			return; // Data already seeded
		}

		// Seed Owners
		var owner1Id = ObjectId.GenerateNewId().ToString();
		var owner2Id = ObjectId.GenerateNewId().ToString();
		var owner3Id = ObjectId.GenerateNewId().ToString();

		var owners = new[]
		{
			new Owner
			{
				IdOwner = owner1Id,
				Name = "Juan Pérez",
				Address = "Calle Principal 123, Ciudad"
			},
			new Owner
			{
				IdOwner = owner2Id,
				Name = "María García",
				Address = "Avenida Central 456, Ciudad"
			},
			new Owner
			{
				IdOwner = owner3Id,
				Name = "Carlos López",
				Address = "Plaza Mayor 789, Ciudad"
			}
		};

		Owners.AddRange(owners);
		await SaveChangesAsync();

		// Seed Properties
		var properties = new[]
		{
			new Property
			{
				IdProperty = ObjectId.GenerateNewId().ToString(),
				IdOwner = owner1Id,
				Name = "Casa Moderna en el Centro",
				Address = "Calle de los Rosales 101, Centro",
				Price = 250000
			},
			new Property
			{
				IdProperty = ObjectId.GenerateNewId().ToString(),
				IdOwner = owner1Id,
				Name = "Apartamento con Vista al Mar",
				Address = "Malecón 202, Zona Costera",
				Price = 180000
			},
			new Property
			{
				IdProperty = ObjectId.GenerateNewId().ToString(),
				IdOwner = owner2Id,
				Name = "Villa Campestre",
				Address = "Camino Rural 303, Afueras",
				Price = 320000
			},
			new Property
			{
				IdProperty = ObjectId.GenerateNewId().ToString(),
				IdOwner = owner2Id,
				Name = "Loft Industrial",
				Address = "Zona Industrial 404, Norte",
				Price = 150000
			},
			new Property
			{
				IdProperty = ObjectId.GenerateNewId().ToString(),
				IdOwner = owner3Id,
				Name = "Casa de Campo",
				Address = "Montañas Verdes 505, Rural",
				Price = 280000
			}
		};

		Properties.AddRange(properties);
		await SaveChangesAsync();
	}
}