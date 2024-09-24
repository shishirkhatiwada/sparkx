import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";



import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import toast from "react-hot-toast";

const Login = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const queryClient = useQueryClient()

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullname, password }) => {
		  const res = await fetch("/api/auth/signin", {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({ email, username, fullname, password }),
		  });
	
		  const data = await res.json();
		  if (!res.ok || data.error) {
			throw new Error(data.error || "Something went wrong");
		  }
	
		  return data;
		},
		onSuccess: () => {
			// refetch the query
			queryClient.invalidateQueries({queryKey:["authUser"]})
		},
		onError: (error) => {
		  toast.error(error.message);
		},
	  });

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};


	return (
		<div className='max-w-screen-xl mx-auto flex gap-10 h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<h3 className="w-240 text-6xl text-blue-500">SPARKX</h3>
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
                <h3 className='w-24 text-4xl text-yellow-600 lg:hidden fill-white' > SPARKX </h3>

					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>
					{isPending ? "loading..." : "Sign in"}
					</button>
					{isError && <p className="text-red-500">{error.message}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default Login;