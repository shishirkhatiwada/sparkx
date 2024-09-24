export const POSTS = [
	{
	  _id: "1",
	  user: {
		username: "john_doe",
		fullName: "John Doe",
		profileImg: "/avatar-placeholder.png", // Optional
	  },
	  text: "This is a dummy post",
	  img: "/path/to/image.jpg", // Optional, can be empty
	  comments: [
		{
		  _id: "1",
		  text: "This is a comment",
		  user: {
			username: "jane_doe",
			fullName: "Jane Doe",
			profileImg: "/avatar-placeholder.png", // Optional
		  },
		},
	  ],
	  likes: [],
	},
	// Add more dummy posts if necessary
  ];
  
export const USERS_FOR_RIGHT_PANEL = [
	{
		_id: "1",
		fullName: "John Doe",
		username: "johndoe",
		profileImg: "/avatars/boy2.png",
	},
	{
		_id: "2",
		fullName: "Jane Doe",
		username: "janedoe",
		profileImg: "/avatars/girl1.png",
	},
	{
		_id: "3",
		fullName: "Bob Doe",
		username: "bobdoe",
		profileImg: "/avatars/boy3.png",
	},
	{
		_id: "4",
		fullName: "Daisy Doe",
		username: "daisydoe",
		profileImg: "/avatars/girl2.png",
	},
];