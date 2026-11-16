import type { Locale } from '@/content/locales'

export const detailLabels: Record<Locale, {
  itinerary: string; included: string; destinations: string; faq: string; video: string; noVideo: string
  groupSize: (count: string) => string; gallery: string; imageUnit: string; allTrips: string
  waMessage: (title: string) => string; askWhatsApp: string; videoPanel: string
}> = {
  ar: {
    itinerary: 'برنامج الرحلة', included: 'ما يشمله البرنامج', destinations: 'الوجهات والمحطات', faq: 'أسئلة عن الرحلة', video: 'مشاهدة فيديو الرحلة', noVideo: 'أضف فيديو هذه الرحلة من لوحة الإدارة.',
    groupSize: (count) => `حتى ${count} مسافرين`, gallery: 'صور من الطريق', imageUnit: 'صور', allTrips: 'كل الرحلات',
    waMessage: (title) => `مرحباً، أود الاستفسار عن رحلة ${title}.`, askWhatsApp: 'استفسر عن الرحلة عبر واتساب', videoPanel: 'إذا أضفت فيديو لهذه الرحلة، سيظهر رابط المشاهدة في بطاقة معلومات الرحلة.',
  },
  en: {
    itinerary: 'Day-by-day itinerary', included: 'What is included', destinations: 'Places along the way', faq: 'Trip questions', video: 'Watch the trip video', noVideo: 'Add a trip video in the admin panel.',
    groupSize: (count) => `Up to ${count} travellers`, gallery: 'Scenes from the journey', imageUnit: 'IMAGES', allTrips: 'All journeys',
    waMessage: (title) => `Hello, I would like to ask about the ${title} trip.`, askWhatsApp: 'Ask about this trip on WhatsApp', videoPanel: 'A trip video link will appear in the journey information panel once added.',
  },
  fr: {
    itinerary: 'Programme jour par jour', included: 'Prestations incluses', destinations: 'Étapes du voyage', faq: 'Questions sur le voyage', video: 'Voir la vidéo du voyage', noVideo: 'Ajoutez la vidéo depuis le panneau d’administration.',
    groupSize: (count) => `Jusqu’à ${count} voyageurs`, gallery: 'Images du voyage', imageUnit: 'IMAGES', allTrips: 'Tous les voyages',
    waMessage: (title) => `Bonjour, je souhaite me renseigner sur le voyage « ${title} ».`, askWhatsApp: 'Demander des informations sur WhatsApp', videoPanel: 'Le lien vidéo apparaîtra ici lorsqu’il sera ajouté.',
  },
  es: {
    itinerary: 'Itinerario día a día', included: 'Qué incluye', destinations: 'Lugares del recorrido', faq: 'Preguntas del viaje', video: 'Ver vídeo del viaje', noVideo: 'Añade el vídeo desde el panel de administración.',
    groupSize: (count) => `Hasta ${count} viajeros`, gallery: 'Imágenes del viaje', imageUnit: 'IMÁGENES', allTrips: 'Todos los viajes',
    waMessage: (title) => `Hola, quisiera consultar sobre el viaje ${title}.`, askWhatsApp: 'Consultar este viaje por WhatsApp', videoPanel: 'El enlace al vídeo aparecerá aquí cuando se añada.',
  },
  zh: {
    itinerary: '每日行程', included: '行程包含', destinations: '沿途目的地', faq: '旅程常见问题', video: '观看旅程视频', noVideo: '请在管理后台添加旅程视频。',
    groupSize: (count) => `最多 ${count} 位旅客`, gallery: '旅途影像', imageUnit: '张图片', allTrips: '全部旅程',
    waMessage: (title) => `您好，我想咨询「${title}」旅程。`, askWhatsApp: '通过 WhatsApp 咨询此行程', videoPanel: '添加视频后，旅程信息面板将显示视频链接。',
  },
  ja: {
    itinerary: '日ごとの行程', included: '旅行に含まれるもの', destinations: '訪問地', faq: '旅についての質問', video: '旅の動画を見る', noVideo: '管理画面から旅の動画を追加してください。',
    groupSize: (count) => `最大 ${count} 名`, gallery: '旅の風景', imageUnit: '枚', allTrips: 'すべての旅',
    waMessage: (title) => `こんにちは。「${title}」の旅について問い合わせたいです。`, askWhatsApp: 'WhatsAppでこの旅について問い合わせる', videoPanel: '動画を追加すると、ここに旅の動画リンクが表示されます。',
  },
  de: {
    itinerary: 'Tagesprogramm', included: 'Inklusivleistungen', destinations: 'Stationen der Reise', faq: 'Fragen zur Reise', video: 'Reisevideo ansehen', noVideo: 'Füge ein Reisevideo im Adminbereich hinzu.',
    groupSize: (count) => `Bis zu ${count} Reisende`, gallery: 'Eindrücke von der Reise', imageUnit: 'BILDER', allTrips: 'Alle Reisen',
    waMessage: (title) => `Hallo, ich möchte mich nach der Reise „${title}“ erkundigen.`, askWhatsApp: 'Diese Reise über WhatsApp anfragen', videoPanel: 'Der Link zum Reisevideo erscheint hier, sobald er hinzugefügt wurde.',
  },
}
