
export interface InstagramProfile {
  username: string;
  fullName: string;
  profilePicture: string;
  bio: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  followers: Follower[];
  posts: Post[];
}

export interface Follower {
  id: string;
  username: string;
  fullName: string;
  profilePicture: string;
  isVerified: boolean;
}

export interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  likesCount: number;
  timestamp: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  username: string;
  profilePicture: string;
  text: string;
  timestamp: string;
}

export const mockInstagramProfile: InstagramProfile = {
  username: "traveler.earth",
  fullName: "Travel Earth",
  profilePicture: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
  bio: "🌍 Exploring the world one photo at a time\n✈️ Travel tips and inspiration\n📸 All photos by me\n🔗 travelerearth.com",
  postsCount: 342,
  followersCount: 56800,
  followingCount: 512,
  isVerified: true,
  followers: [
    {
      id: "1",
      username: "adventure_time",
      fullName: "Adventure Time",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      isVerified: false
    },
    {
      id: "2",
      username: "mountain_lover",
      fullName: "Mountain Explorer",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      isVerified: false
    },
    {
      id: "3",
      username: "photo.grapher",
      fullName: "Professional Photography",
      profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      isVerified: true
    },
    {
      id: "4",
      username: "ocean_vibes",
      fullName: "Ocean Vibes",
      profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
      isVerified: false
    },
    {
      id: "5",
      username: "city_explorer",
      fullName: "City Explorer",
      profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      isVerified: false
    },
    {
      id: "6",
      username: "nature_photography",
      fullName: "Nature Photography",
      profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3",
      isVerified: true
    },
    {
      id: "7",
      username: "food_traveler",
      fullName: "Food & Travel",
      profilePicture: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
      isVerified: false
    },
    {
      id: "8",
      username: "wanderlust_soul",
      fullName: "Wanderlust Soul",
      profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      isVerified: false
    }
  ],
  posts: [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.0.3",
      caption: "Exploring the beautiful mountains of Switzerland 🏔️ #travel #mountains #switzerland",
      likesCount: 3452,
      timestamp: "2023-06-15T14:23:00Z",
      comments: [
        {
          id: "c1",
          username: "mountain_lover",
          profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "This is absolutely stunning! Which trail is this?",
          timestamp: "2023-06-15T15:01:00Z"
        },
        {
          id: "c2",
          username: "adventure_time",
          profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "Adding this to my bucket list right now! 😍",
          timestamp: "2023-06-15T16:12:00Z"
        },
        {
          id: "c3",
          username: "photo.grapher",
          profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "The lighting in this shot is perfect! What camera did you use?",
          timestamp: "2023-06-15T17:45:00Z"
        },
        {
          id: "c4",
          username: "wanderlust_soul",
          profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "I was there last summer! Such an amazing place!",
          timestamp: "2023-06-16T09:23:00Z"
        },
        {
          id: "c5",
          username: "nature_photography",
          profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "The colors in this photo are incredible! 💙",
          timestamp: "2023-06-16T11:05:00Z"
        }
      ]
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3",
      caption: "Paris is always a good idea 🗼 #paris #france #travel",
      likesCount: 4218,
      timestamp: "2023-05-22T10:15:00Z",
      comments: [
        {
          id: "c6",
          username: "city_explorer",
          profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "My favorite city in the world! Great shot!",
          timestamp: "2023-05-22T11:02:00Z"
        },
        {
          id: "c7",
          username: "food_traveler",
          profilePicture: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "Did you try the croissants at that bakery I recommended?",
          timestamp: "2023-05-22T12:30:00Z"
        },
        {
          id: "c8",
          username: "adventure_time",
          profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "I'm going next month! Any recommendations?",
          timestamp: "2023-05-22T14:45:00Z"
        },
        {
          id: "c9",
          username: "wanderlust_soul",
          profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "This view never gets old! 😍",
          timestamp: "2023-05-23T08:12:00Z"
        },
        {
          id: "c10",
          username: "photo.grapher",
          profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "Perfect composition! The lighting is magical.",
          timestamp: "2023-05-23T09:30:00Z"
        }
      ]
    },
    {
      id: "3",
      imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3",
      caption: "Beach vibes in Bali 🏝️ #bali #beach #paradise",
      likesCount: 5129,
      timestamp: "2023-04-10T09:30:00Z",
      comments: [
        {
          id: "c11",
          username: "ocean_vibes",
          profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "This is my dream destination! The water looks amazing!",
          timestamp: "2023-04-10T10:15:00Z"
        },
        {
          id: "c12",
          username: "adventure_time",
          profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "I need to be there right now! 😭",
          timestamp: "2023-04-10T11:23:00Z"
        },
        {
          id: "c13",
          username: "mountain_lover",
          profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "Even as a mountain person, I have to admit this looks incredible!",
          timestamp: "2023-04-10T13:45:00Z"
        },
        {
          id: "c14",
          username: "food_traveler",
          profilePicture: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "The seafood there is amazing! Did you try the grilled fish?",
          timestamp: "2023-04-11T08:30:00Z"
        },
        {
          id: "c15",
          username: "wanderlust_soul",
          profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "Which beach is this exactly? It's stunning!",
          timestamp: "2023-04-11T09:15:00Z"
        }
      ]
    },
    {
      id: "4",
      imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1983&auto=format&fit=crop&ixlib=rb-4.0.3",
      caption: "Venice canals never disappoint ⛵ #venice #italy #travel",
      likesCount: 3876,
      timestamp: "2023-03-05T16:45:00Z",
      comments: [
        {
          id: "c16",
          username: "city_explorer",
          profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "Venice is like a dream! Great capture!",
          timestamp: "2023-03-05T17:30:00Z"
        },
        {
          id: "c17",
          username: "photo.grapher",
          profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "The light reflection on the water is perfect!",
          timestamp: "2023-03-05T18:15:00Z"
        },
        {
          id: "c18",
          username: "food_traveler",
          profilePicture: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "The gelato there is to die for! 🍦",
          timestamp: "2023-03-05T19:45:00Z"
        },
        {
          id: "c19",
          username: "adventure_time",
          profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "Did you take a gondola ride? It's expensive but worth it!",
          timestamp: "2023-03-06T09:10:00Z"
        },
        {
          id: "c20",
          username: "wanderlust_soul",
          profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "One of my favorite cities in the world! 💙",
          timestamp: "2023-03-06T10:30:00Z"
        }
      ]
    },
    {
      id: "5",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      caption: "Sunset in Santorini 🌅 #santorini #greece #sunset",
      likesCount: 6234,
      timestamp: "2023-02-18T18:30:00Z",
      comments: [
        {
          id: "c21",
          username: "ocean_vibes",
          profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "The most beautiful sunset I've ever seen was in Santorini!",
          timestamp: "2023-02-18T19:15:00Z"
        },
        {
          id: "c22",
          username: "photo.grapher",
          profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "The colors are incredible! No filter needed in Santorini!",
          timestamp: "2023-02-18T20:00:00Z"
        },
        {
          id: "c23",
          username: "adventure_time",
          profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "This is making me want to book a trip right now!",
          timestamp: "2023-02-18T21:30:00Z"
        },
        {
          id: "c24",
          username: "wanderlust_soul",
          profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "Which part of Santorini is this? Oia?",
          timestamp: "2023-02-19T08:45:00Z"
        },
        {
          id: "c25",
          username: "city_explorer",
          profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "The white and blue buildings against that sunset! 😍",
          timestamp: "2023-02-19T10:15:00Z"
        }
      ]
    },
    {
      id: "6",
      imageUrl: "https://images.unsplash.com/photo-1492136344046-866c85e0bf04?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.0.3",
      caption: "New York City never sleeps 🌃 #nyc #newyork #cityscape",
      likesCount: 4567,
      timestamp: "2023-01-25T22:15:00Z",
      comments: [
        {
          id: "c26",
          username: "city_explorer",
          profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "The city that never sleeps! Great night shot!",
          timestamp: "2023-01-25T23:00:00Z"
        },
        {
          id: "c27",
          username: "photo.grapher",
          profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "The lighting is perfect! What settings did you use?",
          timestamp: "2023-01-26T00:30:00Z"
        },
        {
          id: "c28",
          username: "food_traveler",
          profilePicture: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "I miss NYC pizza so much! 🍕",
          timestamp: "2023-01-26T09:15:00Z"
        },
        {
          id: "c29",
          username: "adventure_time",
          profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "Where was this taken from? Top of the Rock?",
          timestamp: "2023-01-26T10:45:00Z"
        },
        {
          id: "c30",
          username: "wanderlust_soul",
          profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
          text: "NYC at night is magical! Great capture!",
          timestamp: "2023-01-26T12:30:00Z"
        }
      ]
    }
  ]
};
