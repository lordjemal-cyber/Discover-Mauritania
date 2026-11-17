'use client'

import { useState, type FormEvent } from 'react'
import type { Locale } from '@/content/locales'
import { createClient } from '@/lib/supabase/client'
import { ArrowIcon } from '@/components/arrow-icon'

const messages: Record<Locale, { phone: string; consent: string; privacy: string; submit: string; sending: string; success: string; error: string; configuration: string }> = {
  ar: { phone: 'رقم الهاتف', consent: 'أوافق على استخدام بيانات التواصل هذه للرد على استفساري.', privacy: 'ستُحفظ بياناتك في قاعدة بيانات الموقع لهذا الغرض فقط.', submit: 'إرسال استفسار', sending: 'جارٍ الإرسال…', success: 'وصل استفسارك، سنتواصل معك قريبًا.', error: 'تعذّر حفظ الاستفسار في قاعدة البيانات. حاول مرة أخرى لاحقًا.', configuration: 'إعداد اتصال قاعدة البيانات على الاستضافة غير مكتمل. تواصل معنا عبر واتساب.' },
  en: { phone: 'Phone number', consent: 'I agree that these contact details may be used to reply to my enquiry.', privacy: 'Your details will be stored in the site database for this purpose.', submit: 'Send an enquiry', sending: 'Sending…', success: 'Your enquiry was received. We will contact you soon.', error: 'We could not save your enquiry. Please try again later.', configuration: 'The hosting database connection is not configured. Please contact us on WhatsApp.' },
  fr: { phone: 'Téléphone', consent: 'J’accepte que ces coordonnées soient utilisées pour répondre à ma demande.', privacy: 'Vos coordonnées seront conservées dans la base du site à cette fin.', submit: 'Envoyer une demande', sending: 'Envoi…', success: 'Votre demande a bien été reçue. Nous vous contacterons bientôt.', error: 'Impossible d’enregistrer votre demande. Réessayez plus tard.', configuration: 'La connexion à la base de données sur l’hébergement n’est pas configurée. Contactez-nous sur WhatsApp.' },
  es: { phone: 'Teléfono', consent: 'Acepto que estos datos de contacto se utilicen para responder a mi consulta.', privacy: 'Tus datos se guardarán en la base del sitio para este fin.', submit: 'Enviar consulta', sending: 'Enviando…', success: 'Hemos recibido tu consulta. Nos pondremos en contacto pronto.', error: 'No se pudo guardar la consulta. Inténtalo de nuevo más tarde.', configuration: 'La conexión con la base de datos del alojamiento no está configurada. Contáctanos por WhatsApp.' },
  zh: { phone: '电话号码', consent: '我同意使用这些联系方式回复我的咨询。', privacy: '您的信息将保存在网站数据库中，仅用于此目的。', submit: '发送咨询', sending: '正在发送…', success: '已收到您的咨询，我们会尽快联系您。', error: '无法保存咨询，请稍后重试。', configuration: '网站托管端尚未配置数据库连接。请通过 WhatsApp 联系我们。' },
  ja: { phone: '電話番号', consent: 'この問い合わせへの返信に連絡先を使用することに同意します。', privacy: '連絡先はこの目的のためにサイトのデータベースに保存されます。', submit: '問い合わせを送信', sending: '送信中…', success: 'お問い合わせを受け付けました。近日中にご連絡します。', error: '問い合わせを保存できませんでした。後でもう一度お試しください。', configuration: 'ホスティング側のデータベース接続が設定されていません。WhatsAppでご連絡ください。' },
  de: { phone: 'Telefonnummer', consent: 'Ich stimme zu, dass diese Kontaktdaten zur Beantwortung meiner Anfrage verwendet werden.', privacy: 'Deine Angaben werden dafür in der Datenbank der Website gespeichert.', submit: 'Anfrage senden', sending: 'Wird gesendet…', success: 'Deine Anfrage ist eingegangen. Wir melden uns bald.', error: 'Die Anfrage konnte nicht gespeichert werden. Bitte versuche es später erneut.', configuration: 'Die Datenbankverbindung beim Hosting ist nicht eingerichtet. Bitte kontaktiere uns über WhatsApp.' },
}

type Labels = { name: string; email: string; travelers: string; travelDate: string; message: string }

export function InquiryForm({ locale, labels, defaultMessage = '' }: { locale: Locale; labels: Labels; defaultMessage?: string }) {
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'config'>('idle')
  const text = messages[locale]

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    if (String(data.get('website') || '').trim()) return

    const supabase = createClient()
    if (!supabase) { setStatus('config'); return }
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
      if (error) {
        console.error('Supabase inquiry insert failed', { code: error.code, message: error.message })
        setStatus('error')
        return
      }
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
    <label>{labels.message}<textarea name="message" rows={4} minLength={5} maxLength={5000} defaultValue={defaultMessage} required/></label>
    <div className="inquiry-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <label className="inquiry-consent"><input type="checkbox" name="contact_consent" required/><span>{text.consent}<small>{text.privacy}</small></span></label>
    <button className="button button-ink" disabled={pending}>{pending ? text.sending : text.submit}<ArrowIcon/></button>
    {status !== 'idle' && <p className={`form-result ${status}`} role="status" aria-live="polite">{status === 'success' ? text.success : status === 'config' ? text.configuration : text.error}</p>}
  </form>
}
