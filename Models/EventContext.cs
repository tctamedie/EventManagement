using Microsoft.EntityFrameworkCore;
using Relational.BaseModels.AspNetCore.Generics.Models;

namespace Models
{
    public class EventContext : SecurityContext
    {
        public EventContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<PublicEvent> Events { get; set; }
    }
}
