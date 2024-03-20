
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import lao from './assets/translation/lao.json';
import Backend from 'i18next-http-backend';



i18n.use(initReactI18next).init({
  detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie', 'localStorage'],
    },
  resources: {
    en: {
      translation: {
        ads:"ads"
  
      },
    },
    fr: {
      translation: {
      "ads":"annonce",
      "home":"accueil",
      "location":"lieux",
      "account":"tableau de bord",
      "edit": "créer",
      "login": "connection",
      "logout":"deconnection",
      "loading": "Chargement en cours...",
    "error": "Erreur ! Un problème est survenu.",
    "welcome On Board !": "Bienvenue sur notre site !",
    "Today I want...": "Aujourd'hui, je veux",
  "Buy Something": "Acheter quelque chose",
  "Find What You Need": "Trouver ce dont vous avez besoin",
  "Sell Something": "Vendre quelque chose",
  "Start Selling": "Commencer à vendre",
  "lookingForAJob": "Rechercher un emploi",
  "Explore Job Opportunities": "Explorer les opportunités d'emploi",
    "publication Date": "Date de publication",
    "price": "Prix",
    "viewAd": "Voir l'annonce",
    "ads": "Annonces",
    "adminTitle": "Administration",
    "addAdButton": "Ajouter une annonce",
    "myMessagesButton": "Mes messages",
    "adsTitle": "Annonces",
    "tableId": "ID",
    "tableTitle": "Titre",
    "tableDescription": "Description",
    "tablePrice": "Prix",
    "tablePublicationDate": "Date de publication",
    "tableImages": "Images",
    "tableAction": "Action",
    "Confirm Delete Ad": "Êtes-vous sûr de vouloir supprimer cette annonce ?",
    "Yes": "Oui",
    "No": "Non",
    "No ADS":"Vous n'avez pas d'annonce pour le moment !",
    "Error: You need to login for see ADS":" Impossible d'afficher cette annonce Vous devez vous connecter pour voir les annonces",
    "siteName": "Nom de votre site",
  "aboutUs": "À propos de nous",
  "contactUs": "Contactez-nous",
  "termsConditions": "Termes et conditions",
    "Sorry, This nickname is already taken. Please choose another one.":"Désolé, Ce pseudo est déjà pris. Veuillez en choisir un autre.",
        "category": 'Catégories',
        forRent: 'À louer ou à vendre',
        title: 'Titre',
        description: 'Description',
        price: 'Prix',
        currency: 'Devise',
        dollars: 'Dollars',
        kips: 'Kips',
        image: 'Choisissez une image d\'illustration',
        submit: 'Valider',
        creating: 'En cours...',
        failed: 'La création a échoué.',
        success: 'Annonce créée avec succès !',
         "title": "Créer une Annonce",
    "locationLabel": "Location",
    "selectLocation": "Sélectionnez la location",
    "categoryLabel": "Catégorie",
    "selectCategory": "Sélectionnez la catégorie",
    "forRentLabel": "For Rent or For Sale",
    "selectForRent": "Sélectionnez For Rent ou For Sale",
    "titleLabel": "Titre",
    "titlePlaceholder": "Titre de l'annonce...",
    "descriptionLabel": "Description de l'annonce",
    "Description": "Description de l'annonce",
    "priceLabel": "Prix",
    "pricePlaceholder": "Prix de l'annonce...",
    "currencyLabel": "Monnaie",
    "dollarsOption": "Dollars",
    "kipsOption": "Kips",
    "chooseImage": "Choisissez une image d'illustration",
    "submitButton": "Valider",
    "submitting": "En cours...",
    "errorMessage": "La création a échoué.",
    "Create Ad": "Créer une annonce",
    "upDate":"Modifié",
    "delete":"Supprimé",
    "adDescription":"Description",
    "Are you sure you want to delete this image ?":"Êtes-vous sûr de vouloir supprimer cette image ?",
    "An unexpected error has occurred.":"Une erreur inattendue s\'est produite.",
    "This email is already in use. Please choose another email.":"Cette email est déja enregistré",
    "New Here ?": "Pas encore de compte ? Inscrivez-vous !",
      "Welcome Back":"Déjà un compte ? Connectez-vous !",
      },
    },
    lo: {
      translation :{
     lao,
     "home": "ໜ້າຫຼັກ",
    "ads": "ຄ່າຊ່າງ",
    "location": "ເຊົ່າ",
    "category": "ປະເພດ",
    "edit": "ແກ້ໄຂ",
    "account": "ບັນຊີຂອງຂ້ອຍ",
    "profile": "ໂປຣໄຟຣຂອງຂ້ອຍ",
    "login": "ເຂົ້າສູ່ລະບົບ",
    "logout": "ອອກຈາກລະບົບ",
    "welcome": "ຍິນດີຕ້ອນຮັບ",
    "unreadMessages": "ຂໍ້ຄວາມທີ່ບໍ່ອັບເດດ",
    "search": "ຄົ້ນຫາ",
    "error": "ຂໍອະໄພ! ມີບັນຊີຜິດພາດ.",
    "PublicationDate": "ວັນທີ່ຈັດຫາ",
    "price": "ລາຄາ",
    "viewAd": "ເບິ່ງຄ່າ",
    "ads": "ຄ່າຊ່າ",
   "Login":"ການເຊື່ອມໂຍງ",
    "welcome On Board !": "ຍິນດີທຸກຄົນ!",
    "Today I want...": "ມື້ນີ້, ຂ້ອຍຕ້ອງການ...",
    "Buy Something": "ຊື້ຫນ້າຊ້າງຫຼືສັ່ງຊື້",
    "Find What You Need": "ຊີດນີ້ໃນຕະຫຼາດຂອງພວກເຮົາ.",
    "Sell Something": "ຂາຍຫນ້າຊ້າງ",
    "Start Selling": "ເລີ່ມຕື່ມການຂາຍສິ່ງຂ້ອຍເປັນສູງສຸດ.",
    "Looking For A Job": "ຄົນລວມຄຸ້ມຄອງ",
    "Explore Job Opportunities": "ສະພາບຄຸ້ມຄອງຂອງທ່ານຢູ່ໃນຕະຫຼາດຂອງທ່ານ.",
    "error": "ຂໍອະໄພ! ມີບັນຊີຜິດພາດ.",
    "adminTitle": "ການບໍລິສັດ",
    "addAdButton": "ເພີ່ມຄ່າ",
    "myMessagesButton": "ຄຳອະທິບາຍຂອງຂ້ອຍ",
    "adsTitle": "ຄ່າຊ່າງ",
    "tableId": "ID",
    "tableTitle": "ຫົວຂໍ້",
    "tableDescription": "ຄໍາອະທິບາຍ",
    "tablePrice": "ລາຄາ",
    "publication Date": "ວັນທີ່ຈັດຫາ",
    "tableImages": "ຮູບພາບ",
    "tableAction": "ການກະທຳ",
    "Confirm Delete Ad": "ທ່ານແມ່ນທີ່ແມ່ນຕ້ອງການລົບຄ່ານີ້ບໍ?",
    "Yes": "ຂ້ອຍຕ້ອງການ",
    "No": "ບໍ່"   ,
    "delete":"ລຶບ"  ,
     "siteName": "ຊື່ໂຮງງານຂອງທ່ານ",
  "aboutUs": "ເພີ່ມຕື່ມເພີ່ມຂ່າວ",
  "contactUs": "ຕິດຕໍ່ພວກເຮົາ",
  "termsConditions": "ໂຕະແລກປ່ຽນແປງ,",
   location: 'ສະຖານທີ່',
        category: 'ປະເພດ',
        forRent: 'ຈາກຊ່າງເຊົ່າຫຼືຈາກຊ່າງເຊົ່າ',
        title: 'ຫົວຂໍ້',
        adDescription: 'ຄຳອະທິບາຍ',
        price: 'ລາຄາ',
        currency: 'ເງິນ',
        dollars: 'ດໍລາອິນ',
        kips: 'ຄີບ',
        image: 'ເລືອກຮູບພາບວາງ',
        submit: 'ຕົກລົງ',
        creating: 'ກຳລັງສໍາເລັດ...',
        failed: 'ການສໍາເລັດມີຂຶ້ນ.',
        success: 'ສໍາເລັດການຂາຍສຳເລັດ!',
        "title": "ສ້າງຜົນ",
    "locationLabel": "ສະຖານທີ່",
    "selectLocation": "ເລືອກສະຖານທີ່",
    "categoryLabel": "ປະເພດ",
    "selectCategory": "ເລືອກປະເພດ",
    "forRentLabel": "For Rent or For Sale",
    "selectForRent": "ເລືອກ For Rent ຫຼື For Sale",
    "titleLabel": "ຫົວຂໍ້",
    "titlePlaceholder": "ຫົວຂໍ້ຂອງຜົນ...",
    "descriptionLabel": "ຄຳອະທິບາຍຂອງຜົນ",
    "descriptionPlaceholder": "ຄຳອະທິບາຍຂອງຜົນ...",
    "priceLabel": "ລາຄາ",
    "pricePlaceholder": "ລາຄາຂອງຜົນ...",
    "currencyLabel": "ເງິນ",
    "dollarsOption": "ດອລາ",
    "kipsOption": "ກີບ",
    "chooseImage": "ເລືອກຮູບພາບສ້າງຜົນ",
    "submitButton": "ຢືນຢັນ",
    "submitting": "ກຳລັງຢືນຢັນ...",
    "errorMessage": "ການສ້າງຜົນລົ້ມເຫຼວ.",
     "Create Ad" : "ກຳລັງສໍ",
     "upDate": "ປັບປຸງ",
     "Sorry, This nickname is already taken. Please choose another one.":"ຂໍອະໄພ, ຊື່ຫຼິ້ນນີ້ຖືກເອົາໄປກ່ອນແລ້ວ. ກະລຸນາເລືອກອັນອື່ນ.",
     "Are you sure you want to delete this image ?":"ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຮູບນີ້",
     "New Here ?":"ຢູ່ນີ້ໃໝ່ບໍ?",
       "Welcome Back":"ຍິນ​ດີ​ຕ້ອນ​ຮັບ​ກັບ",
       "8 characters minimum":"ຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ",
       "1 digit minimum":"ຕ່ຳສຸດ 1 ຕົວເລກ",
      "1 lower case letter minimum" : " 1 ຕົວພິມນ້ອຍຕໍາ່ສຸດທີ່ຕົວອັກສອນ",
      "1 upper case letter minimum": "1 ຕົວພິມໃຫຍ່ຕ",
      "1 special character minimum": "ຢ່າງໜ້ອຍ 1 ຕົວອັກສອນພິເສດ",

       "50 characters maximum": "ສູງສຸດ 50 ຕົວອັກສອນ",
   
      " 8 characters minimum": "ໜ້ອຍເທື່ອ 8 ອັກສອນ",
  "1 digit minimum": "ໜ້ອຍເທື່ອ 1 ໂຕອັກສອນ",
  "1 lower case letter minimum": "ໜ້ອຍເທື່ອ 1 ຕົວອັກສອນໜ້າ",
  "1 upper case letter minimum": "ໜ້ອຍເທື່ອ 1 ຕົວອັກສອນເກົ່າ",
  "1 special character minimum": "ໜ້ອຍເທື່ອ 1 ອົງການພວກດິນ",
  "50 characters maximum": "ສູງສຸດ 50 ອັກສອນ",
   
   
   
    },
  },
  },
  lng: 'en', 
  fallbackLng: 'en', 
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
