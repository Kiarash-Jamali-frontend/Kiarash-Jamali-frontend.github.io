import { create } from 'zustand';
import supabase from '../supabase/client';
import { type Database } from '../../database.types';
import { persist } from 'zustand/middleware';
import type { Grade } from './grade';

type Book = Database['public']['Tables']['book']['Row'];

interface BooksState {
    books: Book[];
    isLoading: boolean;
    fetchBooks: (grade: Grade) => Promise<void>;
    getBookById: (id: number) => Book | undefined;
}

const useBooksStore = create<BooksState>()(
    persist(
        (set, get) => ({
            books: [],
            isLoading: true,
            fetchBooks: async (grade: Grade) => {
                set({ isLoading: true });
                const { data, error } = await supabase.from('book').select('*').eq("grade", grade);
                if (!error && data) {
                    set({ books: data, isLoading: false });
                } else {
                    set({ isLoading: false });
                }
            },
            getBookById: (id: number) => {
                return get().books.find(book => book.id === id);
            }
        }), {
        name: "books"
    }
    )
);

export default useBooksStore;