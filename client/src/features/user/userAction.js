

import { useconfirmUserMutation } from '../api/apiSlice';

export const confirmUserAccount = (confirmationCode) => async (dispatch) => {
  try {
    const result = await dispatch(useconfirmUserMutation(confirmationCode));

    if (useconfirmUserMutation.fulfilled.match(result)) {
     
    } else if (useconfirmUserMutation.rejected.match(result)) {
      
      
    }
  } catch (error) {
    
  }
};
