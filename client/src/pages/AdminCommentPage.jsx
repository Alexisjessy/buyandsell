

import React from 'react';
import Loader from '../components/Loader';
import CommentList from '../components/CommentList';
import { useTranslation } from 'react-i18next';

const AdminCommentPage = () => {
  const { t } = useTranslation();
   
  return (
    <section>
      <h2>{t('Admin Comments')}</h2>
      <CommentList />
    </section>
  );
};

export default AdminCommentPage;
