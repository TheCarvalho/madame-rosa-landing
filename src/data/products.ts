import { assetUrl } from '../assets'

export interface Product {
  id: number
  name: string
  price: number
  category: string
  description: string
  image: string
  emoji: string
  label: string
}

// Produtos e fotos demonstrativos: substitua pelos itens reais quando quiser.
export const products: Product[] = [
  { id: 1, name: 'Gloss Framboesa', price: 19.9, category: 'Beleza', description: 'Brilhinho de quem sabe que é a protagonista.', image: assetUrl('images/promo-instagram.jpg'), emoji: '💋', label: 'queridinho' },
  { id: 2, name: 'Ventilador Florzinha', price: 25, category: 'Novidades', description: 'Pra seguir plena até no calor de 40 graus.', image: assetUrl('images/ventiladores.jpg'), emoji: '🌸', label: 'novo por aqui' },
  { id: 3, name: 'Garrafa Brilhante', price: 70, category: 'Mais vendidos', description: 'Hidratação com presença de milhões.', image: assetUrl('images/garrafas.jpg'), emoji: '✨', label: 'mais vendido' },
  { id: 4, name: 'Love Kit', price: 49.9, category: 'Presentes', description: 'Um presente pra você. Sim, você merece.', image: assetUrl('images/promo-instagram.jpg'), emoji: '🎀', label: 'presenteável' },
  { id: 5, name: 'Máscara de Cílios', price: 23, category: 'Beleza', description: 'Olhar de quem viu o preço e levou dois.', image: assetUrl('images/promo-instagram.jpg'), emoji: '👁️', label: 'um mimo' },
  { id: 6, name: 'Kit Autoestima', price: 39.9, category: 'Presentes', description: 'Pequenos luxos, grandes eventos no espelho.', image: assetUrl('images/inauguracao.jpg'), emoji: '👑', label: 'feito pra você' },
  { id: 7, name: 'Acessório Rosa', price: 15.9, category: 'Acessórios', description: 'Porque o look pediu um detalhe a mais.', image: assetUrl('images/garrafas.jpg'), emoji: '💗', label: 'pink alert' },
  { id: 8, name: 'Achadinho Surpresa', price: 29.9, category: 'Outros', description: 'Você não precisava. Mas seu coração precisava.', image: assetUrl('images/ventiladores.jpg'), emoji: '🛍️', label: 'achadinho' },
]
