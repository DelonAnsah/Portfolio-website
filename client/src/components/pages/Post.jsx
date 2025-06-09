import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { client } from '../../client';


const Post = () => {
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    client
      .fetch(`*[_type == 'post']{
      title,
      slug,
      mainImage{
        asset->{
          _id,
          url
        },
        alt
      }
      }`)
      .then((data) => setPostData(data))
      .catch(console.error);
  }, []);

  return (
    <main className='min-h-screen p-12 text-gray-900'>
      <section className="container mx-auto">
        <h2 className="text-5xl justify-center cursive font-bold mb-4">Blog Posts</h2>
        <p className="text-lg text-gray-600 flex justify-center mb-12">Coming soon: insights, stories, and updates.</p>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {postData && postData.map((post, index) => (
            <article key={post.slug.current}>
              <Link to={'/post/' + post.slug.current} >
                <span className='block h-64 relative rounded shadow leading-snug bg-white border-l-8 border-green-400'
                  key={index}>
                  <img src={post.mainImage.asset.url} alt={post.main}
                    className='w-full h-full rounded-r object-cover absolute' />
                  <span className='block relative h-full flex justify-end items-end pr-4 pb-4'>
                    <h3 className='text-gray-800 text-lg font-bond px-3 py-4 bg-gray-900 text-white bg-opacity-75 rounded'>{post.title}</h3>
                  </span>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Post
