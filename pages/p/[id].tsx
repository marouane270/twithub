import Link from 'next/link';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Layout from '../../components/Layout';
import { PostProps } from '../../components/Post';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
      comments : {
        select: {
          userIdC: {
            select: { 
              name: true,
          }},
          message: true,
        }
    },
  }});
  console.log(post)
  return {
    props: post,
  };
};

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: 'PUT',
  });
  await Router.push('/');
}

async function deletePost(id: string): Promise<void> {
    await fetch(`/api/post/${id}`, {
      method: 'DELETE',
    });
    Router.push('/');
  }


  async function createComment(id: string,message: string): Promise<void> {
    if(message && message.length > 0){
      try {
        const body = { id, message };
        const res = await fetch('/api/comment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const result = await res.json();
  
      } catch (error) {
        console.error(error);
      }
      await Router.push(Router.asPath);
    }
  }

const Post: React.FC<PostProps> = (props) => {
  const [comment,setComment]= useState('');
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Brouillons)`;
  }
  var commentTxt;
  if (!props.published && userHasValidSession && postBelongsToUser && props.comments == null) {
    commentTxt =  <br></br> ;
  } 
  /*useEffect(() => {
    console.log(props.id)
  
    
  }, [])*/
  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>Publié par {props?.author?.name || 'Unknown author'}</p>
        <p>{props.content}</p>
        <br></br>
        {/* {
          (Array.isArray(props.comments)) : {
            props.comments.map(function (element){
              
              <div>
              <br></br>
              <h3>Commentaires :</h3>
              <h5> à répondu : {element.message }</h5>
              </div>
            
            }
          } ? {
            <div></div>
          }){
            
          }
            props.comments.map(function (element){
              
              <div>
              <br></br>
              <h3>Commentaires :</h3>
              <h5> à répondu : {element.message }</h5>
              </div>
            
            }
          )
        } */}
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Publier</button>
        )}
        {
        userHasValidSession && postBelongsToUser && (
        <button onClick={() => deletePost(props.id)}>Supprimer</button>
        )
        }
        <br></br>
        <h3>Commentaires :</h3>
        {
          
            props.comments.map(element=>
                 
                 /*<div className="flex items-start px-4 py-6 w-full">
                  <div className="w-full">
                    <p className="text-gray-700">{element.userIdC.name}</p>
                    <p className="mt-3 text-gray-700 text-sm">
                        {element.message}
                    </p>
                  </div>
                 </div>*/    
                  <h5 key={element.id} > {element.userIdC.name} à répondu : { element.message }</h5>
      
           )
         
        }
        
        
        {
          userHasValidSession && props.published &&(
            <div className="flex flex-col px-4 py-6 bg-white shadow-lg rounded-lg mx-2 md:mx-auto w-full my-4 max-w-md md:max-w-2xl ">
            <label htmlFor="content">
              <p className="font-medium text-slate-700 pb-2 text-lg font-semibold text-gray-900 -mt-1"> </p>
              <input
                  onChange={(e)=>setComment(e.target.value)}
                  type="text"
                  id="content"
                  name="content"
                  title="Comment section"
                  pattern="[a-zA-Z]{2,2048}"
                  className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow" placeholder="Entrer un commentaire" />
            </label>
            <button onClick={() => {createComment(props.id,comment)}}
              className="flex w-full items-end justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-700 "
              >Nouveau commentaire</button>
            </div>

          )
        }
        
      </div>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;