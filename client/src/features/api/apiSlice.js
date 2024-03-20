
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Ad'], 

  endpoints: (builder) => ({
    // Get the list of ads
    getAd: builder.query({
      query: () => '/ad',
      invalidatesTags: ['Ad'],
    }),

    // Get ads to display on the home page
    getHomePageAd: builder.query({
      query: () => '/ad/edit',
    }),

    // Get information about a product
    getProduct: builder.query({
      query: (id) => `/ad/${id}`,
      invalidatesTags: ['Ad'],
    }),

    getUserId: builder.query({
      query: () => '/user',
      invalidatesTags: ['Ad'],
    }),

    // Get ads of a user and associated ad images
    getUserAds: builder.query({
      query: (id) => `/user/ad`,
    }),
    invalidatesTags: ['Ad'],

    // Delete an ad belonging to a user by its id
    deleteUserAd: builder.mutation({
      query: (id) => `/user/delete/ad/${id}`,
      invalidatesTags: ['Ad'],
    }),

    // Delete an image belonging to a user by its id
    deleteImage: builder.mutation({
      query: (imageId) => ({
        url: `/user/delete/image/${imageId}`, 
        method: 'DELETE',
      }),
      invalidatesTags: ['Ad'],
    }),

    // Get categories and associated ads to display on the category page
    getAdsByCategory: builder.query({
      query: (id) => `category/${id}`,
    }),

    // Get the list of categories
    getCategory: builder.query({
      query: () => '/category',
    }),

    // Filter by location
    getAdsByLocation: builder.query({
      query: (locationId, categoryId) => `location/${locationId}/categories/${categoryId}`,
    }),

    // Register a new user
    registerUser: builder.mutation({
      query: (formData) => ({
        url: '/register',
        method: 'POST',
        body: formData,
      }),
    }),

    // Log in a user
    loginUser: builder.mutation({
      query: ({ password, email }) => ({
        url: `/login`,
        method: 'POST',
        body: { password, email },
      }),
    }),

    // Log out a user
    logoutUser: builder.mutation({
      query: () => `/logout`,
      invalidatesTags: ['Ad'],
    }),

    // Get the message history of a user
    getMessages: builder.query({
      query: ({ userId }) => `/getMessages/${userId}`,
      invalidatesTags: ['Ad'],
    }),

    // Get the message history of a user
    getMessagesHistory: builder.query({
      query: () => '/getAllMessages',
      invalidatesTags: ['Ad'],
    }),

    // Delete a message belonging to a user by its id
    deleteMessages: builder.mutation({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Ad'],
    }),

    getConversations: builder.query({
      query: (userId) => `/getConversations/${userId}`,
      invalidatesTags: ['Ad'],
    }),

    getMessagesForRecipient: builder.query({
      query: (userId, recipientId) => `/getMessagesForRecipient/${userId}/${recipientId}`,
    }),

    // Search by keywords
    getKeywords: builder.query({
      query: (keyword) => `/ad/search/${keyword}`,
      invalidatesTags: ['Ad'],
    }),

    // User confirmation message
    confirmUser: builder.mutation({
      query: (confirmationCode) => ({
        url: `/confirm/${confirmationCode}`,
        method: 'POST',
      }),
    }),

    // Update user's ad
    updateAd: builder.mutation({
      query: (formData) => ({
        url: `/user/ad/${formData.get('id')}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Ad'],
    }),

    updateAdminAd: builder.mutation({
      query: (formData) => ({
        url: `/admin/ad/${formData.get('id')}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Ad'],
    }),

    deleteAdminAd: builder.mutation({
      query: (id) => `/admin/delete/ad/${id}`,
      invalidatesTags: ['Ad'],
    }),

    getUserProfile: builder.query({
      query: (userId) => `/profile/${userId}`,
    }),

    updateUserProfile: builder.mutation({
      query: (formData) => ({
        url: '/user',
        method: 'POST',
        body: formData,
      }),
    }),

    // Get profile ratings of a user
    getProfileRatings: builder.query({
      query: (ownerId) => `ratings/${ownerId}`,
      transformResponse: (response) => response.data || [],
    }),

    // Add a rating for a user
    addRating: builder.mutation({
      query: ({ userId, raterId, comment, score }) => ({
        url: `ratings/${userId}`,
        method: 'POST',
        body: { raterId, comment, score },
      }),
    }),

    // Translate text
    translate: builder.mutation({
      query: ({ text, target_lang }) => ({
        url: '/translate',
        method: 'POST',
        body: { text, target_lang },
      }),
    }),
    // Admin request
    getAllAds: builder.query({
      query: () => '/admin',
    }),
    invalidatesTags: ['Ad'],

    getAllComments: builder.query({
      query: () => '/admin/comments',
    }),
    invalidatesTags: ['Ad'],

    adminDeleteComment: builder.mutation({
      query: (id) => `/admin/delete/comment/${id}`,
      invalidatesTags: ['Ad'],
    }),

    // Create a user ad
    createAd: builder.mutation({
      query: (formData) => ({
        url: '/account/create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Ad'],
    }),
  }),
});

export const {
  useGetCategoryQuery,
  useGetHomePageAdQuery,
  useGetAdQuery,
  useGetUserAdsQuery,
  useGetProductQuery,
  useRegisterUserMutation,
  useGetUserIdQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetAdsByCategoryQuery,
  useGetAdsByLocationQuery,
  useCreateAdMutation,
  useUpdateAdMutation,
  useconfirmUserMutation,
  useDeleteUserAdMutation,
  useDeleteImageMutation,
  useSendMessageMutation,
  useGetMessagesHistoryQuery,
  useGetMessagesQuery,
  useDeleteMessagesMutation,
  useGetKeywordsQuery,
  useGetConversationsQuery,
  useGetMessagesForRecipientQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetProfileRatingsQuery,
  useAddRatingMutation,
  useTranslateMutation,
  useGetAllAdsQuery,
  useUpdateAdminAdMutation,
  useDeleteAdminAdMutation,
  useGetAllCommentsQuery,
  useAdminDeleteCommentMutation,
} = apiSlice;
