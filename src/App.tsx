import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { categories, store } from './data/store'
import { products } from './data/products'
import { assetUrl } from './assets'

const sections = [
  { id: 'achadinhos', label: 'Achadinhos' },
  { id: 'sobre', label: 'A vibe' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'visite', label: 'Onde fica' },
]

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function App() {
  const [category, setCategory] = useState<string>('Todos')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[number] | null>(null)
  const scrollFrame = useRef<number | null>(null)
  const imageDialog = useRef<HTMLDialogElement | null>(null)
  const visibleProducts = category === 'Todos' ? products : products.filter((product) => product.category === category)

  useEffect(() => {
    if (selectedProduct && imageDialog.current && !imageDialog.current.open) imageDialog.current.showModal()
  }, [selectedProduct])

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current)

    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
    const start = window.scrollY
    const end = Math.max(0, start + target.getBoundingClientRect().top - headerHeight - 14)
    const distance = end - start
    if (Math.abs(distance) < 2) return

    const startedAt = performance.now()
    const duration = Math.min(900, Math.max(520, Math.abs(distance) * 0.42))
    let cancelled = false
    const cleanup = () => {
      window.removeEventListener('wheel', interrupt)
      window.removeEventListener('touchstart', interrupt)
      window.removeEventListener('pointerdown', interrupt)
      window.removeEventListener('keydown', interrupt)
    }
    const interrupt = () => {
      if (cancelled) return
      cancelled = true
      if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current)
      scrollFrame.current = null
      cleanup()
    }
    const step = (now: number) => {
      if (cancelled) return
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2
      window.scrollTo(0, start + distance * eased)
      if (progress < 1) scrollFrame.current = requestAnimationFrame(step)
      else {
        scrollFrame.current = null
        cleanup()
      }
    }

    window.addEventListener('wheel', interrupt, { passive: true })
    window.addEventListener('touchstart', interrupt, { passive: true })
    window.addEventListener('pointerdown', interrupt, { passive: true })
    window.addEventListener('keydown', interrupt)
    scrollFrame.current = requestAnimationFrame(step)
  }

  const handleSectionNavigation = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = event.currentTarget
    if (!link.hash) return
    if (link.target && link.target !== '_self') return
    const id = decodeURIComponent(link.hash.slice(1))
    if (!id || !document.getElementById(id)) return
    event.preventDefault()
    setMenuOpen(false)
    const hash = `#${encodeURIComponent(id)}`
    if (window.location.hash !== hash) window.history.pushState(null, '', hash)
    scrollToSection(id)
  }

  useEffect(() => {
    const targets = ['inicio', ...sections.map((section) => section.id)]
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.1, 0.35, 0.65] })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const syncHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (id) scrollToSection(id)
    }
    const frame = requestAnimationFrame(syncHash)
    window.addEventListener('popstate', syncHash)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('popstate', syncHash)
    }
  }, [])

  return <>
    <div className="announcement"><span>Um mimo pra sua autoestima</span><span>Entre, a casa é sua</span><a href={store.instagramUrl} target="_blank" rel="noreferrer">{store.instagramHandle} ↗</a></div>
    <header className="site-header">
      <a className="brand" href="#inicio" onClick={handleSectionNavigation} aria-label="Madame Rosa, início"><img src={assetUrl('images/logo.jpg')} alt="" /><span>Madame <i>Rosa</i></span></a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? 'Fechar' : 'Menu'} <span>{menuOpen ? '×' : '☰'}</span></button>
      <nav className={menuOpen ? 'navigation open' : 'navigation'} aria-label="Navegação principal">
        {sections.map((section) => <a key={section.id} href={`#${section.id}`} onClick={handleSectionNavigation} aria-current={activeSection === section.id ? 'location' : undefined}>{section.label}</a>)}
        <a className="nav-cta" href={store.instagramUrl} target="_blank" rel="noreferrer">Vamos conversar <span>↗</span></a>
      </nav>
    </header>

    <main>
      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> Beleza, cuidado e pequenas alegrias</p>
          <h1>Seu próximo<br />mimo favorito<br /><em>mora aqui.</em></h1>
          <p className="hero-description">Uma lojinha feita para você descobrir novidades, se cuidar com carinho e sair um pouquinho mais feliz.</p>
          <div className="hero-actions"><a className="button button-dark" href="#achadinhos" onClick={handleSectionNavigation}>Conheça a loja <span>↓</span></a><a className="simple-link" href={store.instagramUrl} target="_blank" rel="noreferrer">Acompanhe no Instagram ↗</a></div>
          <div className="hero-note"><span>♡</span><p>Escolhas lindas para<br /><strong>presentear ou se presentear.</strong></p></div>
        </div>
        <div className="hero-visual"><div className="hero-image"><img src={assetUrl('images/dando-uma-olhadinha.jpg')} alt="Gatinha de óculos escuros espiando os produtos da loja" fetchPriority="high" /></div><div className="hero-caption"><span>O seu cantinho pink</span><b>Manaus, AM</b></div><span className="hero-seal" aria-hidden="true">feito<br />com<br /><i>carinho</i> ♡</span></div>
        <a className="scroll-cue" href="#achadinhos" onClick={handleSectionNavigation} aria-label="Role até os achadinhos"><span className="scroll-line" /> role para descobrir <span>↓</span></a>
      </section>

      <section className="intro-strip" aria-label="Sobre a loja"><span>Sem pressa</span><b>✳</b><span>Sem julgamentos</span><b>✳</b><span>Só coisas lindas</span><b>✳</b><span>Do seu jeitinho</span></section>

      <section className="catalog section-wrap" id="achadinhos">
        <div className="section-heading"><div><p className="eyebrow">uma seleção para se apaixonar</p><h2>Achadinhos <em>da vez</em></h2></div><p>Novidades, favoritos e presentes<br />que merecem um lugar na sua rotina.</p></div>
        <div className="filter-row" role="group" aria-label="Filtrar produtos por categoria">{categories.map((item) => <button key={item} type="button" className={category === item ? 'filter active' : 'filter'} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div>
        <div className="product-grid">{visibleProducts.map((product, index) => <article className="product-card" key={product.id} style={{ '--card-index': index } as React.CSSProperties}>
          <button className="product-image" type="button" onClick={() => setSelectedProduct(product)} aria-label={`Ampliar imagem de ${product.name}`}><img src={product.image} alt={`Referência visual para ${product.name}`} loading="lazy" /><span className="product-label">{product.label}</span><span className="product-arrow" aria-hidden="true">⌕</span></button>
          <div className="product-info"><div className="product-title"><h3>{product.name}</h3><span>{money(product.price)}</span></div><p>{product.description}</p></div>
        </article>)}</div>
        <p className="demo-note">Produtos e valores ilustrativos. Consulte disponibilidade e preço atual na loja.</p>
      </section>

      <section className="story" id="sobre"><div className="story-inner"><div className="story-image"><img src={assetUrl('images/gatinha.jpg')} alt="A gatinha de óculos que acompanha a Madame Rosa" loading="lazy" /><span>Ela entende você. ♡</span></div><div className="story-copy"><p className="eyebrow">um lugar para se sentir bem</p><h2>Às vezes, tudo<br />que a gente precisa<br />é de <em>uma olhadinha.</em></h2><p>A Madame Rosa é aquele cantinho gostoso para encontrar beleza, autocuidado e presentes cheios de personalidade. Pode chegar no seu tempo. A gente adora receber você.</p><a className="text-arrow" href="#visite" onClick={handleSectionNavigation}>Venha conhecer de perto <span>→</span></a></div></div></section>

      <section className="instagram-section section-wrap" id="instagram"><div className="instagram-copy"><p className="eyebrow">a gente se encontra por lá</p><h2>Um pouco da loja<br />no seu <em>dia a dia.</em></h2><p>Novidades, ideias de presente e os bastidores da nossa lojinha, direto no seu feed.</p><a className="button button-outline" href={store.instagramUrl} target="_blank" rel="noreferrer">Seguir {store.instagramHandle} <span>↗</span></a></div><div className="social-gallery"><a href={store.instagramUrl} target="_blank" rel="noreferrer" className="social-tile social-tile-large"><img src={assetUrl('images/inauguracao.jpg')} alt="Arte de inauguração da Madame Rosa" loading="lazy" /><span>Um mimo espera por você</span></a><a href={store.instagramUrl} target="_blank" rel="noreferrer" className="social-tile social-tile-top"><img src={assetUrl('images/ventiladores.jpg')} alt="Ventiladores portáteis coloridos" loading="lazy" /></a><a href={store.instagramUrl} target="_blank" rel="noreferrer" className="social-tile social-tile-bottom"><img src={assetUrl('images/garrafas.jpg')} alt="Garrafas coloridas disponíveis na loja" loading="lazy" /></a><div className="gallery-stamp">novidade<br /><i>com carinho</i></div></div></section>

      <section className="visit" id="visite"><div className="visit-inner"><div className="visit-copy"><p className="eyebrow">seu próximo passeio</p><h2>Tem um mimo<br />esperando <em>por você.</em></h2><p>Venha conhecer a Madame Rosa de pertinho. Vai ser um prazer receber você.</p><p className="address"><span>⌖</span>{store.address}</p><a className="button button-dark" href={store.mapUrl} target="_blank" rel="noreferrer">Como chegar <span>↗</span></a></div><div className="visit-card"><img src={assetUrl('images/Fachada da loja.jpg')} alt="Fachada da loja Madame Rosa" loading="lazy" /><div><span>ANOTE AÍ</span><p>Rua Argentina, 436<br />Parque das Nações · Manaus</p></div></div></div></section>

      <section className="closing"><p className="eyebrow">seu próximo favorito está por aqui</p><h2>Um carinho<br /><em>em forma de mimo.</em></h2></section>
    </main>

    <dialog ref={imageDialog} className="image-lightbox" aria-labelledby="image-lightbox-title" onClose={() => setSelectedProduct(null)} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close() }}>
      {selectedProduct && <>
        <form method="dialog"><button className="image-lightbox-close" type="submit" aria-label="Fechar imagem ampliada" autoFocus>×</button></form>
        <h2 id="image-lightbox-title">{selectedProduct.name}</h2>
        <img src={selectedProduct.image} alt={`Imagem ampliada de ${selectedProduct.name}`} />
      </>}
    </dialog>

    <footer className="footer"><a className="footer-brand" href="#inicio" onClick={handleSectionNavigation}><img src={assetUrl('images/logo.jpg')} alt="" /><span>Madame <i>Rosa</i></span></a><p>Beleza, cuidado e pequenas alegrias.<br />Feito com carinho em Manaus. ♡</p><div className="footer-links">{sections.map((section) => <a key={section.id} href={`#${section.id}`} onClick={handleSectionNavigation}>{section.label}</a>)}</div><div className="footer-bottom"><span>© {new Date().getFullYear()} Madame Rosa</span><a href="#inicio" onClick={handleSectionNavigation}>Voltar ao início ↑</a></div></footer>
  </>
}

export default App
