'use client'

import Link from 'next/link'
import { useEffect, useState, type ChangeEvent } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { copy, localeCodes, type Locale } from '@/content/locales'
import { getSavedTour, TOUR_STORAGE_KEY, type TourOverride, type TourText } from '@/components/tour-card'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { loadPublicTourOverride, saveTourToSupabase } from '@/lib/supabase/tours'

const tours = copy.ar.programs
const textFields: (keyof TourText)[] = ['title', 'subtitle', 'route', 'itinerary', 'included', 'destinations', 'faq']
const labelByField: Record<keyof TourText, string> = {
  title: 'اسم الرحلة', subtitle: 'وصف مختصر', route: 'المسار', itinerary: 'برنامج الأيام', included: 'ما يشمله السعر', destinations: 'الوجهات والمحطات', faq: 'أسئلة شائعة عن الرحلة',
}
const sharedFields: (keyof TourOverride)[] = ['price', 'currency', 'duration', 'departure', 'available', 'total', 'groupSize', 'image', 'gallery', 'video']

function editorValues(id: string, locale: Locale, source?: TourOverride): TourOverride {
  const trip = copy[locale].programs.find((item) => item.id === id)!
  const saved = source ?? getSavedTour(id)
  const content = saved.translations?.[locale] || {}
  return {
    ...saved,
    title: content.title ?? trip.title,
    route: content.route ?? trip.route,
    subtitle: content.subtitle ?? trip.subtitle,
    itinerary: content.itinerary ?? '',
    included: content.included ?? '',
    destinations: content.destinations ?? '',
    faq: content.faq ?? '',
    currency: saved.currency ?? 'USD',
    image: saved.image ?? '',
    gallery: saved.gallery ?? '',
    video: saved.video ?? '',
  }
}

const localeNames: Record<Locale, string> = { en: 'English', ar: 'العربية', fr: 'Français', es: 'Español', zh: '中文', ja: '日本語', de: 'Deutsch' }

function lines(value?: string) {
  return (value || '').split('\n').map((line) => line.trim()).filter(Boolean)
}

export function AdminDashboard() {
  const [access, setAccess] = useState<'checking' | 'local-demo' | 'setup' | 'signed-out' | 'denied' | 'ready'>('checking')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [authPending, setAuthPending] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAccess(process.env.NODE_ENV === 'development' ? 'local-demo' : 'setup')
      return
    }
    const supabase = createClient()
    if (!supabase) { setAccess('setup'); return }
    let alive = true
    const verify = async (userId?: string) => {
      if (!userId) {
        const { data } = await supabase.auth.getUser()
        userId = data.user?.id
      }
      if (!alive) return
      if (!userId) { setAccess('signed-out'); return }
      const { data, error } = await supabase.rpc('is_site_admin')
      if (!alive) return
      setAccess(error ? 'setup' : data ? 'ready' : 'denied')
    }
    void verify()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      queueMicrotask(() => { void verify(session?.user.id) })
    })
    return () => { alive = false; subscription.unsubscribe() }
  }, [])

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const supabase = createClient()
    if (!supabase) { setAccess('setup'); return }
    setAuthPending(true)
    setAuthMessage('')
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error || !data.user) {
      setAuthMessage('تعذر تسجيل الدخول. راجع البريد وكلمة المرور وإعداد Supabase.')
      setAuthPending(false)
      return
    }
    const { data: admin, error: roleError } = await supabase.rpc('is_site_admin')
    if (roleError || !admin) {
      await supabase.auth.signOut()
      setAccess('denied')
      setAuthMessage('هذا الحساب غير مضاف إلى قائمة مديري الموقع.')
    } else {
      setAccess('ready')
    }
    setAuthPending(false)
  }

  if (access !== 'ready' && access !== 'local-demo') {
    const title = access === 'setup' ? 'أكمل ربط قاعدة البيانات' : access === 'denied' ? 'هذا الحساب لا يملك صلاحية الإدارة' : access === 'checking' ? 'جارٍ التحقق من الدخول' : 'دخول مدير الموقع'
    return <main className="admin-gate" lang="ar" dir="rtl"><Link className="wordmark" href="/ar"><span className="wordmark-symbol">م</span><span>اكتشف موريتانيا<small>إدارة الموقع</small></span></Link><section className="admin-gate-card"><p className="eyebrow-dark">مساحة خاصة بمدير الموقع</p><h1>{title}</h1>{access === 'setup' ? <><p>أضف بيانات Supabase إلى متغيرات البيئة، ثم طبّق ملف التهيئة واتبع خطوات إعداد أول مدير في دليل النشر.</p><span className="prototype-pill">التحرير مقفول حتى يكتمل الإعداد</span></> : access === 'checking' ? <p>نتحقق من جلسة Supabase وصلاحية المدير.</p> : <form className="admin-login-form" onSubmit={signIn}><label>البريد الإلكتروني<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)}/></label><label>كلمة المرور<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)}/></label>{authMessage && <p className="admin-auth-error" role="alert">{authMessage}</p>}<button className="button button-ink" disabled={authPending}>{authPending ? 'جارٍ تسجيل الدخول…' : 'تسجيل الدخول'}</button><small>لا يوجد تسجيل مفتوح للعامة. ينشئ مالك المشروع حساب المدير من لوحة Supabase.</small></form>}</section></main>
  }
  return <AdminEditor access={access} onSignOut={async () => { const supabase = createClient(); await supabase?.auth.signOut(); setAccess('signed-out') }}/>
}

function AdminEditor({ access, onSignOut }: { access: 'ready' | 'local-demo'; onSignOut: () => void }) {
  const [active, setActive] = useState(tours[0].id)
  const [activeLocale, setActiveLocale] = useState<Locale>('ar')
  const [values, setValues] = useState<TourOverride>({ currency: 'USD' })
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [pricedCount, setPricedCount] = useState(0)
  const selected = tours.find((item) => item.id === active)!

  useEffect(() => {
    let alive = true
    if (access === 'ready') {
      void loadPublicTourOverride(active, activeLocale).then((loaded) => {
        if (alive) setValues(editorValues(active, activeLocale, loaded || {}))
      }).catch(() => { if (alive) setValues(editorValues(active, activeLocale, {})) })
    } else setValues(editorValues(active, activeLocale))
    return () => { alive = false }
  }, [access, active, activeLocale])
  useEffect(() => {
    if (access === 'local-demo') {
      setPricedCount(tours.filter((item) => Boolean(getSavedTour(item.id).price)).length)
      return
    }
    let alive = true
    void Promise.all(tours.map((item) => loadPublicTourOverride(item.id, 'ar'))).then((items) => {
      if (alive) setPricedCount(items.filter((item) => Boolean(item?.price)).length)
    }).catch(() => { if (alive) setPricedCount(0) })
    return () => { alive = false }
  }, [access])
  function update(key: keyof TourOverride, value: string) { setValues((current) => ({ ...current, [key]: value })) }
  async function uploadImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files || [])
    event.currentTarget.value = ''
    if (!files.length) return
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    const invalidFile = files.find((file) => !allowedTypes.includes(file.type) || file.size > 50 * 1024 * 1024)
    if (invalidFile) {
      setNotice('اختر صور JPG أو PNG أو WebP، على ألا يتجاوز حجم الصورة 50 ميغابايت.')
      return
    }
    const supabase = createClient()
    if (!supabase) {
      setNotice('اربط Supabase أولاً قبل رفع الصور.')
      return
    }
    setUploadingMedia(true)
    setNotice('')
    const uploaded: string[] = []
    let failedName = ''
    let failure = ''
    try {
      for (const file of files) {
        const safeName = file.name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-')
        const path = `${selected.id}/${crypto.randomUUID()}-${safeName || 'image'}`
        const { error } = await supabase.storage.from('tour-media').upload(path, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false,
        })
        if (error) {
          failedName = file.name
          failure = error.message
          break
        }
        uploaded.push(supabase.storage.from('tour-media').getPublicUrl(path).data.publicUrl)
      }
    } catch (error) {
      failedName = 'الملف المحدد'
      failure = error instanceof Error ? error.message : 'خطأ غير معروف'
    }
    if (uploaded.length) {
      setValues((current) => {
        const images = [current.image, ...lines(current.gallery)].filter(Boolean)
        const combined = [...images, ...uploaded]
        return { ...current, image: combined[0] || '', gallery: combined.slice(1).join('\n') }
      })
    }
    if (failedName) {
      setNotice(`رُفع ${uploaded.length} من الصور. تعذّر رفع ${failedName}: ${failure}`)
    } else {
      setNotice(`رُفعت ${uploaded.length} صورة إلى تخزين Supabase. احفظ التغييرات لنشرها في صفحة الرحلة.`)
    }
    setUploadingMedia(false)
  }
  async function save() {
    setSaving(true)
    setNotice('')
    if (access === 'ready') {
      try {
        await saveTourToSupabase(active, selected.category, activeLocale, values)
        window.dispatchEvent(new Event('tour-catalog-updated'))
        setNotice(`حُفظت بيانات «${selected.title}» باللغة ${localeNames[activeLocale]} في قاعدة بيانات الموقع.`)
      } catch (error) {
        setNotice(`تعذر الحفظ في Supabase: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`)
      } finally { setSaving(false) }
      return
    }
    let current: Record<string, TourOverride> = {}
    try { current = JSON.parse(localStorage.getItem(TOUR_STORAGE_KEY) || '{}') } catch { current = {} }
    const saved = current[active] || {}
    const translations = { ...saved.translations, [activeLocale]: Object.fromEntries(textFields.map((field) => [field, values[field]])) as TourText }
    current[active] = {
      ...Object.fromEntries(sharedFields.map((field) => [field, values[field]])),
      translations,
    }
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(current))
    window.dispatchEvent(new Event('tour-catalog-updated'))
    if (access === 'local-demo') setPricedCount(tours.filter((item) => Boolean(getSavedTour(item.id).price)).length)
    setNotice(`حُفظت بيانات «${selected.title}» باللغة ${localeNames[activeLocale]} في هذا المتصفح.`)
    setSaving(false)
    window.setTimeout(() => setNotice(''), 3500)
  }

  return <main className="admin-shell" dir="rtl" lang="ar">
    <aside className="admin-sidebar">
      <Link className="wordmark admin-wordmark" href="/ar"><span className="wordmark-symbol">م</span><span>اكتشف موريتانيا<small>مركز إدارة المحتوى</small></span></Link>
      <p className="admin-overline">مساحة العمل</p>
      <a className="admin-nav-item is-active" href="#overview">▦ <span>نظرة عامة</span></a>
      <a className="admin-nav-item" href="#trip-editor">⌁ <span>بيانات الرحلة</span></a>
      <a className="admin-nav-item" href="#trip-story">☷ <span>البرنامج والتفاصيل</span></a>
      <a className="admin-nav-item" href="#media">▧ <span>الصور والفيديو</span></a>
      <a className="admin-nav-item" href="#bookings">✉ <span>التواصل والحجوزات</span></a>
      <div className="admin-side-bottom"><span className="admin-avatar">م</span><div><strong>مدير الموقع</strong><small>وضع النموذج التجريبي</small></div></div>
    </aside>
    <section className="admin-content">
      <header className="admin-topbar"><div><span>إدارة الموقع</span><b>/</b><strong>محتوى الرحلات</strong></div><div className="admin-top-actions"><Link href="/ar/tours" className="admin-preview-link">عرض صفحة الرحلات ↗</Link>{access === 'ready' && <button className="admin-preview-link" onClick={onSignOut}>تسجيل الخروج</button>}</div></header>
      <div className="admin-page-title" id="overview"><div><p className="eyebrow-dark">مركز التحكم · الرحلات</p><h1>كل تفاصيل رحلاتك، مرتبة وواضحة.</h1><p>اختر الرحلة واللغة، ثم عدّل المعلومات التي تظهر للزوار.</p></div><span className="prototype-pill">{access === 'ready' ? 'متصل بقاعدة البيانات' : 'معاينة محلية فقط'}</span></div>
      <div className="admin-notice"><b>ⓘ</b><span>{access === 'ready' ? 'تحقق الدخول عبر Supabase، وتُحفظ تفاصيل الرحلات في قاعدة البيانات. يمكنك رفع صورك إلى مساحة tour-media أو استخدام روابط وسائط تملك حق نشرها.' : 'هذا وضع معاينة للتطوير فقط؛ تُحفظ التغييرات في هذا المتصفح. لا يظهر هذا الوضع عند النشر، ويتطلب التحرير المنشور ربط Supabase وتسجيل مدير مخوّل.'}</span></div>
      <div className="admin-stats"><article><span>رحلات قابلة للتحرير</span><strong>{String(tours.length).padStart(2, '0')}</strong><small>البرامج المعرفة حالياً بالموقع</small></article><article><span>رحلات لها سعر محفوظ</span><strong>{pricedCount.toString().padStart(2, '0')}</strong><small>{access === 'ready' ? 'قراءة السعر من قاعدة البيانات' : 'تظهر بعد الحفظ في هذه المعاينة'}</small></article><article><span>طلبات المسافرين</span><strong>—</strong><small>لا تصل إلى اللوحة قبل تفعيل نموذج حقيقي</small></article></div>

      <section className="admin-editor" id="trip-editor">
        <div className="admin-editor-heading"><div><p className="eyebrow-dark">01 · بيانات أساسية</p><h2>اختر رحلة ولغة التحرير</h2></div><div className="admin-selectors"><label>الرحلة<select aria-label="اختر الرحلة" value={active} onChange={(event) => setActive(event.target.value)}>{tours.map((tour) => <option value={tour.id} key={tour.id}>{tour.title}</option>)}</select></label><label>لغة المحتوى<select aria-label="لغة المحتوى" value={activeLocale} onChange={(event) => setActiveLocale(event.target.value as Locale)}>{localeCodes.map((locale) => <option value={locale} key={locale}>{localeNames[locale]}</option>)}</select></label></div></div>
        <div className="admin-settings-section"><div className="admin-section-title"><span>أ</span><div><h3>بطاقة الرحلة</h3><p>هذه المعلومات تظهر في قائمة الرحلات وفي صفحة التفاصيل.</p></div></div><div className="admin-form-grid">
          <label>{labelByField.title}<input value={values.title || ''} onChange={(event) => update('title', event.target.value)}/></label>
          <label>{labelByField.route}<input value={values.route || ''} onChange={(event) => update('route', event.target.value)}/></label>
          <label className="wide-field">{labelByField.subtitle}<input value={values.subtitle || ''} onChange={(event) => update('subtitle', event.target.value)}/></label>
          <label>عدد الأيام أو المدة<input placeholder="مثال: 8 أيام" value={values.duration || ''} onChange={(event) => update('duration', event.target.value)}/></label>
          <label>أقصى عدد للمسافرين<input type="number" min="1" placeholder="مثال: 10" value={values.groupSize || ''} onChange={(event) => update('groupSize', event.target.value)}/></label>
        </div></div>

        <div className="admin-settings-section"><div className="admin-section-title"><span>ب</span><div><h3>السعر والتوفر</h3><p>اترك السعر فارغاً إذا لم يكن مؤكداً؛ سيظهر للزائر زر طلب السعر.</p></div></div><div className="admin-form-grid">
          <label>السعر للفرد<input inputMode="decimal" placeholder="مثال: 850" value={values.price || ''} onChange={(event) => update('price', event.target.value)}/></label>
          <label>العملة<select value={values.currency || 'USD'} onChange={(event) => update('currency', event.target.value)}><option>USD</option><option>EUR</option><option>MRU</option></select></label>
          <label>موعد الانطلاق أو الموسم<input placeholder="مثال: نوفمبر – فبراير" value={values.departure || ''} onChange={(event) => update('departure', event.target.value)}/></label>
          <label>المقاعد المتاحة<input type="number" min="0" value={values.available || ''} onChange={(event) => update('available', event.target.value)}/></label>
          <label>إجمالي المقاعد لهذا الموعد<input type="number" min="1" value={values.total || ''} onChange={(event) => update('total', event.target.value)}/></label>
        </div></div>
      </section>

      <section className="admin-editor admin-editor-secondary" id="trip-story">
        <div className="admin-section-title"><span>ج</span><div><p className="eyebrow-dark">02 · تجربة الرحلة</p><h2>البرنامج والمعلومات التي تهم المسافر</h2><p>يُحفظ النص باللغة المحددة أعلاه، ولكل لغة صياغة مستقلة.</p></div></div>
        <div className="admin-form-grid">
          <label className="wide-field">{labelByField.itinerary}<textarea rows={5} placeholder="اليوم الأول: الوصول إلى أطار…&#10;اليوم الثاني: …" value={values.itinerary || ''} onChange={(event) => update('itinerary', event.target.value)}/><small>اكتب كل يوم في سطر مستقل؛ ستظهر النقاط في صفحة الرحلة.</small></label>
          <label>{labelByField.destinations}<textarea rows={4} placeholder="شنقيط&#10;وادان&#10;هضبة أدرار" value={values.destinations || ''} onChange={(event) => update('destinations', event.target.value)}/><small>وجهة واحدة في كل سطر.</small></label>
          <label>{labelByField.included}<textarea rows={4} placeholder="النقل داخل موريتانيا&#10;الإقامة&#10;الوجبات المتفق عليها" value={values.included || ''} onChange={(event) => update('included', event.target.value)}/><small>أدخل الخدمات المؤكدة ضمن الرحلة فقط.</small></label>
          <label className="wide-field">{labelByField.faq}<textarea rows={4} placeholder="ما مستوى صعوبة الرحلة؟ | متوسط&#10;هل يمكن تعديل المسار؟ | نعم، بالتنسيق المسبق" value={values.faq || ''} onChange={(event) => update('faq', event.target.value)}/><small>سؤال وجواب في كل سطر، وافصل بينهما بعلامة |</small></label>
        </div>
      </section>

      <section className="admin-editor admin-editor-secondary" id="media">
        <div className="admin-section-title"><span>د</span><div><p className="eyebrow-dark">03 · الصور والفيديو</p><h2>معرض صور الرحلة</h2><p>أضف روابط وسائط تملك حق استخدامها. يدعم المعرض عدة صور.</p></div></div>
        <div className="admin-form-grid">
          <label className="wide-field">رفع صور من جهازك<input dir="ltr" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploadingMedia} onChange={uploadImages}/><small>تُرفع إلى مساحة tour-media في Supabase. JPG أو PNG أو WebP، حتى 50 ميغابايت للصورة.</small></label>
          <label className="wide-field">الصورة الرئيسية<input dir="ltr" placeholder="https://…" value={values.image || ''} onChange={(event) => update('image', event.target.value)}/></label>
          <label className="wide-field">روابط صور إضافية<textarea dir="ltr" rows={4} placeholder="https://… (رابط لكل صورة في سطر)" value={values.gallery || ''} onChange={(event) => update('gallery', event.target.value)}/><small>صورة واحدة في كل سطر. يمكنك أيضاً رفع الصور من جهازك باستخدام الحقل أعلاه.</small></label>
          <label className="wide-field">رابط فيديو الرحلة<input dir="ltr" placeholder="YouTube / Vimeo URL" value={values.video || ''} onChange={(event) => update('video', event.target.value)}/></label>
        </div>
        <div className="admin-save-row"><p role="status">{notice || (access === 'ready' ? 'احفظ التغييرات لنشرها عبر قاعدة بيانات الموقع.' : 'احفظ المعاينة لمشاهدة التعديلات على صفحات الرحلات في هذا المتصفح.')}</p><button className="button button-ink" onClick={save} disabled={saving || uploadingMedia}>{uploadingMedia ? 'جارٍ رفع الصور…' : saving ? 'جارٍ الحفظ…' : 'حفظ التعديلات'} <span>✓</span></button></div>
      </section>

      <section className="admin-bookings" id="bookings"><div><p className="eyebrow-dark">04 · التواصل والحجوزات</p><h2>واتساب وطلبات المسافرين</h2></div><p>زر واتساب يفتح محادثة مباشرة مع الرقم +222 47 31 53 21. نموذج الحجز لا يرسل رسائل ولا يسجل طلبات حتى ربط خدمة حقيقية واختبارها.</p></section>
      <footer className="admin-footer">{access === 'ready' ? 'تُحفظ البيانات في Supabase · الأسعار والمواعيد مسؤولية مدير الرحلة' : 'التغييرات محلية في هذا المتصفح · الأسعار والمواعيد مسؤولية مدير الرحلة'} <span>DISCOVER MAURITANIA</span></footer>
    </section>
  </main>
}
