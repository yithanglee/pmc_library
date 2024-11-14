"use client"

import { populateData } from '@/components/data/populateData';
import DataTable from '@/components/data/table';
import { Separator } from '@/components/ui/separator';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BooksPage() {
  const router = useRouter();
  // let title = 'All'
  const [title, setTitle] = useState<string>('All')
  const [items, setItems] = useState<any[]>([])
  const [categoryId, setCategoryId] = useState<number | null | string>()

  const searchParams = useSearchParams();
  function gridFn(e: any) {
    return '/books/' + e.id + '/detail'
  }

  useEffect(() => {
    populateData({ model: 'BookCategory' }).then((res) => {
      setItems(res.data.sort((a: any, b: any) => {
        return a.code.localeCompare(b.code)
      }))
    });


  }, []);


  useEffect(() => {
    const currentCategoryCode = searchParams.get('category_code');
    if (currentCategoryCode) {
   
      let item = items.filter((v) => {
        return v.code == currentCategoryCode
      })[0]
      if (item) {
        setCategoryId(item.id);
        setTitle(`${item.code} ${item.name || ''}`);
        const currentParams = new URLSearchParams(searchParams);
        // Set or update the page_no parameter
        currentParams.set("category_code", item.code);
        router.push(`/books?${currentParams.toString()}`);
      }

    }
  }, [items, searchParams])




  return <>
    <div className=' min-h-screen'>

      <main className="container mx-auto px-4 py-8">

        <div className='mx-auto flex flex-col lg:flex-row'>
          <div className='hidden lg:block flex mb-8 lg:mr-8 shadow-lg rounded-lg p-8 blur-white flex-col lg:w-1/4'>
          <div key='title' className='font-bold mb-2 pl-3'>Categories </div>
           
            < div key={0} ><div className='p-3 cursor-pointer'
              onClick={() => {
                setCategoryId("");
                setTitle(`All`);
                const currentParams = new URLSearchParams(searchParams);
                currentParams.delete("category_code");
                currentParams.set("page_no", "1");
                router.push(`/books?${currentParams.toString()}`);
              }}

            >All</div><Separator /></div>

            {items.map((item, itemIndex) => (

              < div key={itemIndex} ><div className='p-3 cursor-pointer'
                onClick={() => {
                  setCategoryId(item.id);
                  setTitle(`${item.code} ${item.name || ''}`);
                  const currentParams = new URLSearchParams(searchParams);
                  currentParams.set("category_code", item.code);
                  currentParams.set("page_no", "1");
                  router.push(`/books?${currentParams.toString()}`);
                }}

              >{item.code} {item.name}</div><Separator /></div>


            ))}
          </div>
          <div className='shadow-lg rounded-lg p-8 blur-white  lg:w-3/4'>
            <div className='flex flex-col my-2 mb-8 gap-2'>
              <div className='text-sm text-gray-400'>Currently browsing</div>
              <div className='font-bold text-xl'>{title}</div>

            </div>
            <DataTable canDelete={false}
              showNew={false}
              showGrid={true}
              gridFn={gridFn}
              modelPath='books'
              itemsPerPage={15}
              // appendQueries={{ book_category_id: categoryId }}
              model={'BookInventory'}
              preloads={['book', 'book_category', 'author', 'publisher', 'organization', 'book_images']}
              join_statements={[{ book: 'book' }, { author: 'author' }, { publisher: 'publisher' }]}
              search_queries={['a.book_category_id=' + categoryId + '|b.title|c.name|d.name']}
              customCols={
                [
                  {
                    title: 'General',
                    list: [
                      'id',
                      'code',
                      'book.title',
                      'book.price',
                      'book.isbn',
                      'book.call_no',
                      { label: 'update_assoc.book', hidden: true, value: "true" },
                      { label: 'book_image.img_url', upload: true },
                      {
                        label: 'organization_id',
                        customCols: null,
                        selection: 'Organization',
                        search_queries: ['a.name'],
                        newData: 'name',
                        title_key: 'name'
                      }

                    ]
                  },
                  {
                    title: 'Detail',
                    list: [

                    ]
                  },
                ]
              }
              columns={[
                {
                  label: 'Cover', data: 'img_url', through: ['book_images'], showImg: true,
                  altClass: 'flex items-center justify-center  rounded  h-[260px] p-4  pb-3'
                },
                {
                  label: 'Category', data: 'name', through: ['book_category'],
                  altClass: 'text-gray-500 text-xs pb-1 mb-1 border-b-2 border-gray-400 min-h-[30px]'
                },
                {
                  label: 'Title', data: 'title', through: ['book'],
                  altClass: 'font-bold min-h-[20px]'
                },
                {
                  label: 'Name', data: 'name', through: ['author'],
                  altClass: 'text-gray-500  font-light  text-sm my-1'
                },
                { label: 'Barcode', data: 'code', altClass: 'text-gray-500 text-xs' },
              ]}
            />
          </div>

        </div>

      </main>

    </div>



  </>

    ;
}
