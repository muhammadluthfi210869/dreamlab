export interface ServiceItem {
  image: string;
  title: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  items: ServiceItem[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'skincare',
    name: 'Skincare',
    items: [
      { image: '/new asset/skincare&facecare/acne-facial-toner.webp', title: 'Acne Facial Toner' },
      { image: '/new asset/skincare&facecare/acne-facial-wash.webp', title: 'Acne Facial Wash' },
      { image: '/new asset/skincare&facecare/acne.webp', title: 'Acne Cream' },
      { image: '/new asset/skincare&facecare/brightening.webp', title: 'Brightening Facial Wash' },
      { image: '/new asset/skincare&facecare/physical-sunscreen.webp', title: 'Physical Sunscreen' },
      { image: '/new asset/skincare&facecare/cleansing-oill.webp', title: 'Cleansing Oil' },
      { image: '/new asset/skincare&facecare/cleasing-balm.webp', title: 'Cleansing Balm' },
      { image: '/new asset/skincare&facecare/eye-cream.webp', title: 'Eye Cream' },
      { image: '/new asset/skincare&facecare/face-cleansing-oil.webp', title: 'Face Cleansing Oil' },
      { image: '/new asset/skincare&facecare/moizturizing-cream.webp', title: 'Facial Cream' },
      { image: '/new asset/skincare&facecare/facial-wash.webp', title: 'Facial Wash' },
      { image: '/new asset/skincare&facecare/feminine-cleanser.webp', title: 'Feminine Cleanser' },
      { image: '/new asset/skincare&facecare/micellar-cleansing-gel.webp', title: 'Micellar Cleansing Gel' },
      { image: '/new asset/skincare&facecare/micellar-water.webp', title: 'Micellar Water' },
      { image: '/new asset/skincare&facecare/milk-cleanser.webp', title: 'Milk Cleanser' },
      { image: '/new asset/skincare&facecare/mois-facial-toner.webp', title: 'Moisturizing Facial Toner' },
      { image: '/new asset/skincare&facecare/mois-facial-wash.webp', title: 'Moisturizing Facial Wash' },
      { image: '/new asset/skincare&facecare/moizturizing-cream.webp', title: 'Moisturizing Cream' },
      { image: '/new asset/skincare&facecare/peel-mask.webp', title: 'Peel Mask' },
      { image: '/new asset/skincare&facecare/peeling-serum.webp', title: 'Peeling Serum' },
      { image: '/new asset/skincare&facecare/radiant-serum.webp', title: 'Radiant Serum' },
      { image: '/new asset/skincare&facecare/serum-gel.webp', title: 'Serum Gel' },
      { image: '/new asset/skincare&facecare/sleeping-mask.webp', title: 'Sleeping Mask' },
      { image: '/new asset/skincare&facecare/slimming-cream.webp', title: 'Slimming Cream' },
      { image: '/new asset/skincare&facecare/sunscreen-gel.webp', title: 'Sunscreen Gel' },
      { image: '/new asset/skincare&facecare/tone-up-suncreen.webp', title: 'Tone Up Sunscreen' },
      { image: '/new asset/skincare&facecare/wash-off-mask.webp', title: 'Wash Off Mask' },
    ],
  },
  {
    id: 'babycare',
    name: 'Baby Care',
    items: [
      { image: '/new%20asset/baby-care/baby-wash.webp', title: 'Baby Wash' },
      { image: '/new%20asset/baby-care/baby-shampoo.webp', title: 'Baby Shampoo' },
      { image: '/new%20asset/baby-care/baby-lotion.webp', title: 'Baby Lotion' },
      { image: '/new%20asset/baby-care/baby-powder.webp', title: 'Baby Powder' },
      { image: '/new%20asset/baby-care/baby-cologne.webp', title: 'Baby Cologne' },
    ],
  },
  {
    id: 'bodycare',
    name: 'Bodycare',
    items: [
      { image: '/new asset/bodycare/anti-bacterial-soap.webp', title: 'Anti Bacterial Soap' },
      { image: '/new asset/bodycare/bar-soap.webp', title: 'Bar Soap' },
      { image: '/new asset/bodycare/bath-salt.webp', title: 'Bath Salt' },
      { image: '/new asset/bodycare/body-butter.webp', title: 'Body Butter' },
      { image: '/new asset/bodycare/body-scrub.webp', title: 'Body Scrub' },
      { image: '/new asset/bodycare/body-serum-new.jpeg', title: 'Body Serum' },
      { image: '/new asset/bodycare/body-wash.webp', title: 'Body Wash' },
      { image: '/new asset/bodycare/massage-cream.webp', title: 'Massage Cream' },
      { image: '/new asset/bodycare/massage-oil.webp', title: 'Massage Oil' },
      { image: '/new asset/bodycare/neck-cream.webp', title: 'Neck Cream' },
      { image: '/new asset/bodycare/organic-soap.webp', title: 'Organic Soap' },
      { image: '/new asset/bodycare/shower-gel.webp', title: 'Shower Gel' },
      { image: '/new asset/bodycare/soothing-gel.webp', title: 'Soothing Gel' },
      { image: '/new asset/bodycare/transparant-soap.webp', title: 'Transparant Soap' },
      { image: '/new asset/bodycare/underarm-cream.webp', title: 'Underarm Cream' },
      { image: '/new asset/bodycare/whitening-soap.webp', title: 'Whitening Soap' },
    ],
  },
  {
    id: 'haircare',
    name: 'Hair Care',
    items: [
      { image: '/new asset/haircare/beard-serum.webp', title: 'Beard Serum' },
      { image: '/new asset/haircare/hair-conditioner.webp', title: 'Hair Conditioner' },
      { image: '/new asset/haircare/hair-gel.webp', title: 'Hair Gel' },
      { image: '/new asset/haircare/hair-mask.webp', title: 'Hair Mask' },
      { image: '/new%20asset/haircare/pomade.webp', title: 'Pomade' },
      { image: '/new asset/haircare/sclap-care.webp', title: 'Scalp Care' },
      { image: '/new%20asset/haircare/shampoo.webp', title: 'Shampoo' },
    ],
  },
  {
    id: 'decorative',
    name: 'Decorative',
    items: [
      { image: '/new asset/make up/bb-cream.webp', title: 'BB Cream' },
      { image: '/new asset/make up/cream-blush.webp', title: 'Cream Blush' },
      { image: '/new asset/make up/eyebrow-gel.webp', title: 'Eyebrow Gel' },
      { image: '/new asset/make up/face-primer.webp', title: 'Face Primer' },
      { image: '/new%20asset/make%20up/foundation.webp', title: 'Foundation' },
      { image: '/new%20asset/make%20up/foundationserum.webp', title: 'Foundation Serum' },
      { image: '/new asset/make up/liquid-blush.webp', title: 'Liquid Blush' },
      { image: '/new asset/make up/liquid-highlighter.webp', title: 'Liquid Highlighter' },
      { image: '/new%20asset/make%20up/mascara.webp', title: 'Mascara' },
    ],
  },
  {
    id: 'parfum',
    name: 'Parfum',
    items: [
      { image: '/new asset/parfum/body-mist.webp', title: 'Body Mist' },
      { image: '/new%20asset/parfum/edc.webp', title: 'EDC' },
      { image: '/new%20asset/parfum/edpp.webp', title: 'EDP' },
      { image: '/new%20asset/parfum/edt.webp', title: 'EDT' },
      { image: '/new asset/parfum/essential-oil.webp', title: 'Essential Oil' },
      { image: '/new asset/parfum/extrait-de-parfum.webp', title: 'Extrait de Parfum' },
    ],
  },
  {
    id: 'pkrt',
    name: 'PKRT',
    items: [
      { image: '/new asset/pkrt/bar-soap.webp', title: 'Bar Soap' },
      { image: '/new%20asset/pkrt/hand-sanis.webp', title: 'Hand Sanitizer' },
      { image: '/new asset/pkrt/hand-wash.webp', title: 'Hand Wash' },
      { image: '/new asset/pkrt/herbal-soap.webp', title: 'Herbal Soap' },
    ],
  },
  {
    id: 'footcare',
    name: 'Foot Care',
    items: [
      { image: '/new asset/footcare/Footcream-maklon .png', title: 'Foot Care' },
    ],
  },
];
