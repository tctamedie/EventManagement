using Models;
using Relational.BaseModels.AspNetCore.Generics;
using Relational.BaseModels.AspNetCore.Generics.Services;

namespace Services
{
    public interface IPublicEventService : IStandardMakerService<PublicEvent, PublicEventDto, int, EventContext, StandardFilter>
    {

    }
    public class PublicEventService : StandardMakerService<PublicEvent, PublicEventDto, int, EventContext, StandardFilter>, IPublicEventService
    {
        public PublicEventService(EventContext context) : base(context)
        {
            
        }
    }
}
