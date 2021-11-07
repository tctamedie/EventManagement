using Microsoft.Extensions.Logging;
using Models;
using Relational.BaseModels.AspNetCore.Generics;
using Services;

namespace Sample.Portal.Controllers
{
    public class PublicEventsController : RecordController<PublicEvent, PublicEventDto, int, StandardFilter>
    {
        public PublicEventsController(IPublicEventService service, ILogger<IPublicEventService> logger):base(service,logger)
        {
            
        }

        
    }
}
