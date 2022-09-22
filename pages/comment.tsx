import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Router, { useRouter } from 'next/router';

const Comment: React.FC = () => {
    const [message, setContent] = useState('');
    const Router = useRouter();
    const submitData = async (e: React.SyntheticEvent) => {
      e.preventDefault();
      // TODO
      // You will implement this next ...
      try {
          const body = { message };
          console.log(body)
          await fetch('/api/comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          await Router.push('/');
        } catch (error) {
          console.error(error);
        }
    };
    useEffect(() => {
      console.log(Router.route)
    
      
    }, [])
    
    return (
        <Layout>
          <div>
            <form onSubmit={submitData}>
              <h1>Nouveau commentaire</h1>
              
              <textarea
                cols={50}
                onChange={(e) => setContent(e.target.value)}
                placeholder="..."
                rows={8}
                value={message}
              />
              <input disabled={!message} type="submit" value=" Commenter " />
              <a className="back" href="#" onClick={() => Router.push('/')}>
                Annuler
              </a>
            </form>
          </div>
          <style jsx>{`
            .page {
              background: var(--geist-background);
              padding: 3rem;
              display: flex;
              justify-content: center;
              align-items: center;
            }
    
            input[type='text'],
            textarea {
              width: 100%;
              padding: 0.5rem;
              margin: 0.5rem 0;
              border-radius: 0.25rem;
              border: 0.125rem solid rgba(0, 0, 0, 0.2);
            }
    
            input[type='submit'] {
              background: #ececec;
              border: 0;
              padding: 1rem 2rem;
            }
    
            .back {
              margin-left: 1rem;
            }
          `}</style>
        </Layout>
      );
    };
    
    export default Comment;  