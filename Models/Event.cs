using Relational.BaseModels.AspNetCore.Generics;
using Relational.BaseModels.AspNetCore.Generics.Annotations;
using System;

namespace Models
{
    [EntityConfiguration("PublicEvents","", "Events")]
    public class PublicEvent: StandardMaker<int>
    {
        [Column(order:3)]
        public DateTime StartDate { get; set; }
        [Column(order: 4)]
        public DateTime EndDate { get; set; }
    }
    [FormConfiguration("PublicEvents","","Events")]
    public class PublicEventDto : StandardMakerDto<int>
    {
        [Field(2,1)]
        public DateTime StartDate { get; set; }
        [Field(2, 1)]
        public DateTime EndDate { get; set; }
    }
}
