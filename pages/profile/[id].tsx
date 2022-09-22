import React, { useEffect, useRef, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const user = await prisma.user.findUnique({
        where: {
          customLink: params?.id.toString(),
        },
        select: {
            name: true,
            bio: true,
            customLink: true,
            image: true
          },
      });
    return {
      props: { user },
    };
  };
  
  
  async function getFullProfile(id,setContent){

    const response = await fetch(`/api/user/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    const user = result;

    const handleSubmit = async (event) => {

      event.preventDefault()

      const body = {
        customLink: event.target.customLink.value,
        bio: event.target.bio.value
      }



      try {
      const res = await fetch(`/api/user/${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
      });
      await res.json()
      if(res.status == 209){
        Router.push(("/profile/"+body.customLink));
      }

      } catch (error) {
          console.error(error);
      }
  
    }


    setContent((
      <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
        <Link href="/">
          <svg className="cursor-pointer w-11 h-11 p-2 rounded-full hover:bg-slate-100" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M224 480h640a32 32 0 110 64H224a32 32 0 010-64z" /><path fill="currentColor" d="M237.248 512l265.408 265.344a32 32 0 01-45.312 45.312l-288-288a32 32 0 010-45.312l288-288a32 32 0 1145.312 45.312L237.248 512z" /></svg>

        </Link>
        <h1 className="w-full text-4xl font-medium text-center">Profile editing</h1>

        <form onSubmit={handleSubmit} className="my-10">
                <div className="flex flex-col space-y-5">
                    <label htmlFor="customLink">
                        <p className="font-medium text-slate-700 pb-2">Custom Link</p>
                        <input
                            defaultValue={user.customLink}
                            type="text"
                            id="customLink"
                            name="customLink"
                            title="name should be name"
                            pattern="[a-zA-Z0-9]{2,35}"
                            className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow" placeholder="Enter string for your custom URL" />
                    </label>
                    <label htmlFor="customImage">
                        <p className="font-medium text-slate-700 pb-2">Image link</p>
                        <input
                            defaultValue={user.customImage??user.image}
                            type="link"
                            id="customImage"
                            name="customImage"
                            title="name should be name"
                            className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow" placeholder="Enter a custom link" />
                    </label>
                    <label htmlFor="customName">
                        <p className="font-medium text-slate-700 pb-2">NickName :</p>
                        <input
                            defaultValue={user.customName??user.name}
                            type="text"
                            id="customName"
                            name="customName"
                            title="customName should be customName"
                            pattern="[a-zA-Z ]{2,35}"
                            className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow" placeholder="Enter nickname" />
                    </label>

                    <label htmlFor="bio">
                        <p className="font-medium text-slate-700 pb-2">Biography</p>
                        <input 
                            defaultValue={user.bio}
                            type="test"
                            id="bio"
                            name="bio"
                            title="email should be email"
                            className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow" placeholder="Enter little biography" />
                    </label>
                    
                    
                    <button type="submit" className="disabled:opacity-75 disabled:bg-sky-500 disabled:cursor-not-allowed w-full py-3 font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg border-sky-500 hover:shadow inline-flex space-x-2 items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>Save</span>
                    </button>

                </div>
            </form>
      </div>
    ))
    return user;

  }

  function getPartialProfile(user,setContent){
    setContent((
      <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
      <div className="relative grid gap-6 px-5 py-6 sm:gap-8 sm:p-8">
        <div className="h-full flex items-center">
          <img alt="team" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src={user.customImage ??user.image} />
          <div className="flex-grow">
            <h2 className="text-gray-900 title-font font-medium">{user.customName ?? user.name}</h2>
            <p className="text-gray-500">{user.bio?? "Not Bio yet"}</p>
          </div>
        </div>
      </div>
      </div>

    ));
  }

const Profile = (props) => {
    const [content,setContent] = useState(null)
    const [user,setUser] = useState(props.user)
    const router = useRouter()
    const { data: session } = useSession();
    
    useEffect(() => {
      if(!user){
        router.push('/404')
      }else if(session && session.link == user.customLink){
        getFullProfile(session.userId,setContent);

      }else {
        getPartialProfile(user,setContent)

      }
    }, []);
    
    return (
      <Layout>
        <div>
          {content}
        </div>
  
      </Layout>
    );
  };
  

export default Profile;