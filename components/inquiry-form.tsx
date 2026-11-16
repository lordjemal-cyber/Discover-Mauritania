'use client'

import { useState, type FormEvent } from 'react'
import type { Locale } from '@/content/locales'
import { createClient } from '@/lib/supabase/client'

const messages: Record<Locale, { phone: string; consent: string; privacy: string; submit: string; sending: string; success: string; error: string }> = {
  ar: { phone: 'رقم الهاتف', consent: 'أوافق على استخدام بيانات التواصل هذه للرد على استفساري.', privacy: 'ستُحفظ بياناتك في قاعدة بيانات الموقع لهذا الغرض فقط.', submit: 'إرسال استفسار', sending: 'جارٍ الإرسال…', success: 'وصل استفسارك، سنتواصل معك قريبًا.', error: 'تعذّر إرسال الاستفسار. تحقق من اتصالك وحاول مرة أخرى.' },
  en: { phone: 'Phone number', consent: 'I agree that these contact details may be used to reply to my enquiry.', privacy: 'Your details will be stored in the site database for this purpose.', submit: 'Send an enquiry', sending: 'Sending…', success: 'Your enquiry was received. We will contact you soon.', error: 'We could not send your enquiry. Check your connection and try again.' },
  fr: { phone: 'Téléphone', consent: 'J’accepte que ces coordonnées soient utilisées pour répondre à ma demande.', privacy: 'Vos coordonnées seront conservées dans la base du site à cette fin.', submit: 'Envoyer une demande', sending: 'Envoi…', success: 'Votre demande a bien été reçue. Nous vous contacterons bientôt.', error: 'Impossible d’envoyer votre demande. Vérifiez votre connexion et réessayez.' },
  es: { phone: 'Teléfono', consent: 'Acepto que estos datos de contacto se utilicen para responder a mi consulta.', privacy: 'Tus datos se guardarán en la base del sitio para este fin.', submit: 'Enviar consulta', sending: 'Enviando…', success: 'Hemos recibido tu consulta. Nos pondremos en contacto pronto.', error: 'No se pudo enviar la consulta. Comprueba tu conexión e inténtalo de nuevo.' },
  zh: { phone: '电话号码', consent: '我同意使用这些联系方式回复我的咨询。', privacy: '您的信息将保存在网站数据库中，仅用于此目的。', submit: '发送咨询', sending: '正在发送…', success: '已收到您的咨询，我们会尽快联系您。', error: '无法发送咨询。请检查网络后重试。' },
  ja: { phone: '電話番号', consent: 'この問い合わせへの返信に連絡先を使用することに同意します。', privacy: '連絡先はこの目的のためにサイトのデータベースに保存されます。', submit: '問い合わせを送信', sending: '送信中…', success: 'お問い合わせを受け付けました。近日中にご連絡します。', error: '送信できませんでした。接続を確認して再度お試しください。' },
  de: { phone: 'Telefonnummer', consent: 'Ich stimme zu, dass diese Kontaktdaten zur Beantwortung meiner Anfrage verwendet werden.', privacy: 'Deine Angaben werden dafür in der Datenbank der Website gespeichert.', submit: 'Anfrage senden', sending: 'Wird gesendet…', success: 'Deine Anfrage ist eingegangen. Wir melden uns bald.', error: 'Die Anfrage konnte nicht gesendet werden. Prüfe deine Verbindung und versuche es erneut.' },
}

type Labels = { name: string; email: string; travelers: string; travelDate: string; message: string }

export function InquiryForm({ locale, labels }: { locale: Locale; labels: Labels }) {
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const text = messages[locale]

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    if (String(data.get('website') || '').trim()) return

    const supabase = createClient()
    if (!supabase) { setStatus('error'); return }
    setPending(true)
    setStatus('idle')
    try {
      const { error } = await supabase.from('inquiries').insert({
        full_name: String(data.get('full_name') || '').trim(),
        email: String(data.get('email') || '').trim(),
        phone: String(data.get('phone') || '').trim(),
        travel_date: String(data.get('travel_date') || '') || null,
        travelers: Number(data.get('travelers')),
        message: String(data.get('message') || '').trim(),
      })
      if (error) { setStatus('error'); return }
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setPending(false)
    }
  }

  return <form className="inquiry-form" onSubmit={submit}>
    <label>{labels.name}<input name="full_name" autoComplete="name" minLength={2} maxLength={120} required/></label>
    <label>{labels.email}<input name="email" type="email" autoComplete="email" maxLength={254} required/></label>
    <label>{text.phone}<input name="phone" type="tel" autoComplete="tel" minLength={5} maxLength={40} required/></label>
    <div className="form-row"><label>{labels.travelers}<input name="travelers" type="number" min="1" max="20" defaultValue="1" required/></label><label>{labels.travelDate}<input name="travel_date" type="date"/></label></div>
    <label>{labels.message}<textarea name="message" rows={4} minLength={5} maxLength={5000} required/></label>
    <div className="inquiry-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <label className="inquiry-consent"><input type="checkbox" name="contact_consent" required/><span>{text.consent}<small>{text.privacy}</small></span></label>
    <button className="button button-ink" disabled={pending}>{pending ? text.sending : text.submit}<span>↗</span></button>
    {status !== 'idle' && <p className={`form-result ${status}`} role="status" aria-live="polite">{status === 'success' ? text.success : text.error}</p>}
  </form>
}
