using DatingApp.API.Dtos;
using DatingApp.API.Models;
using AutoMapper;
using System.Diagnostics;
using System.Linq;

namespace DatingApp.API.Helpers
{
   
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        // CreateMap<Source, Destination>
        {
            CreateMap<User, UserForListDto>()
            //sets photo url
                .ForMember(dest => dest.PhotoUrl, 
                opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
            //sets age field
                .ForMember(dest => dest.Age, opt => 
                opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<User, UserForDetailedDto>()
            //sets photo url
                .ForMember(dest => dest.PhotoUrl, 
                opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
            //sets age field
                .ForMember(dest => dest.Age, opt => 
                opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotosForDetailedDto>();
            CreateMap<UserForUpdatesDto, User>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>();
        }
    }
}