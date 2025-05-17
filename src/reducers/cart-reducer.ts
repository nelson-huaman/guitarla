import { db } from "../data/db";
import type { CartItem, GuitarT } from "../types";

export type CartActions =
   { type: 'add-to-cart', payload: {item: GuitarT} } |
   { type: 'remove-from-cart', payload: {id: GuitarT['id']} } |
   { type: 'decrease-quantity', payload: {id: GuitarT['id']} } |
   { type: 'increase-quantity', payload: {id: GuitarT['id']} } |
   { type: 'clear-cart' }

export type CartState = {
   data: GuitarT[],
   cart: CartItem[]
}

const initialCart = () : CartItem[] => {
   const localStorageCart = localStorage.getItem("cart");
   return localStorageCart ? JSON.parse(localStorageCart) : [];
}

export const initialState : CartState = {
   data: db,
   cart: initialCart()
}


const MIN_ITEMS = 1;
const MAX_ITEMS = 5;

export const cartReducer = (state : CartState = initialState, action : CartActions) => {

   if(action.type === 'add-to-cart') {

      const itemExists = state.cart.find(guitar => guitar.id === action.payload.item.id);

      let cart : CartItem[] = []
      if(itemExists) {
         cart = state.cart.map(item => {
            if(item.id === action.payload.item.id && item.quantity < MAX_ITEMS) {
               return { ...item, quantity: item.quantity + 1 }
            } else {
               return item
            }
         })
      } else {
         const newItem : CartItem = { ...action.payload.item, quantity: 1 };
         cart = [...state.cart, newItem]
      }

      return {
         ...state,
         cart
      }
   }
   
   if(action.type === 'remove-from-cart') {
      const cart = state.cart.filter(item => item.id !== action.payload.id)
      return {
         ...state,
         cart
      }
   }

   if(action.type === 'decrease-quantity') {
      const cart = state.cart.map(item => {
         if(item.id === action.payload.id && item.quantity > MIN_ITEMS) {
            return { ...item, quantity: item.quantity - 1 }
         }
         return item;
      })
      return {
         ...state,
         cart
      }
   }

   if(action.type === 'increase-quantity') {
      const cart = state.cart.map(item => {
         if(item.id === action.payload.id && item.quantity < MAX_ITEMS) {
            return { ...item, quantity: item.quantity + 1 }
         }
         return item;
      })
      return {
         ...state,
         cart
      }
   }

   if(action.type === 'clear-cart') {
      return {
         ...state,
         cart: []
      }
   }
   return state
}