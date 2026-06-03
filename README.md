# 🎂 Invitación de cumpleaños — Next.js + Firebase

Invitación web interactiva con cuenta regresiva en vivo, mesa de regalos, votos de bebidas, muro de mensajes y RSVP. Todo persistido en Firebase Firestore.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| Base de datos | Firebase Firestore (tiempo real) |
| Deploy | Vercel (gratis) |
| Tipografía | Playfair Display + DM Sans |
| Animaciones | CSS puro |

---

## 🚀 Configuración paso a paso

### 1 — Clonar e instalar

```bash
git clone <tu-repo>
cd birthday-invite
npm install
```

### 2 — Crear proyecto en Firebase

1. Ve a [https://console.firebase.google.com](https://console.firebase.google.com)
2. Clic en **"Add project"** → ponle un nombre (ej. `cumple-valentina`)
3. Desactiva Google Analytics si no lo necesitas → **Create project**
4. En el menú lateral: **Firestore Database** → **Create database** → modo **Production** → elige región `nam5 (us-central)`
5. En el menú lateral: **Project Settings** (ícono ⚙) → pestaña **"Your apps"** → clic en `</>` (Web)
6. Registra la app, copia los valores de `firebaseConfig`

### 3 — Variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env.local
```



### 4 — Reglas de Firestore

En la consola de Firebase → **Firestore** → pestaña **Rules**, pega el contenido de `firestore.rules` y publica.

### 5 — Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 📦 Deploy en Vercel (recomendado)

```bash
# Instala la CLI de Vercel
npm i -g vercel

# Deploy
vercel

# En las preguntas: Framework = Next.js, deja el resto por defecto
```

Vercel te dará una URL como `cumple-valentina.vercel.app`.

**Importante:** en el dashboard de Vercel → tu proyecto → **Settings → Environment Variables**, agrega todas las variables de `.env.local`. Sin esto Firebase no conectará en producción.

---

## 🗂 Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx        # Fuentes + metadata
│   ├── globals.css       # Todo el CSS
│   ├── page.tsx          # Página principal
│   └── admin/
│       └── page.tsx      # Panel de admin (con contraseña)
├── components/
│   ├── ParticlesBg.tsx   # Estrellas + confetti
│   ├── Countdown.tsx     # Cuenta regresiva en vivo
│   ├── GiftsList.tsx     # Mesa de regalos (Firebase)
│   ├── DrinksList.tsx    # Votos de bebidas (Firebase)
│   ├── MessageWall.tsx   # Muro de mensajes (Firebase)
│   └── RSVPForm.tsx      # Confirmación de asistencia (Firebase)
└── lib/
    ├── firebase.ts       # Inicialización Firebase
    ├── firestore.ts      # Todas las funciones de datos
    └── config.ts         # Config de la fiesta + listas
```

---

## 🎁 Personalizar regalos y bebidas

Edita `src/lib/config.ts`:

```ts
export const GIFTS = [
  { id: 'g1', emoji: '💄', name: 'Kit de maquillaje', hint: 'Charlotte Tilbury' },
  // agrega o quita los que quieras
]

export const DRINKS = [
  { id: 'd1', emoji: '🍾', name: 'Champagne', desc: 'Para el brindis' },
  // ...
]
```

---

## ⚙ Panel de administración

Entra a `/admin` con la contraseña definida en `NEXT_PUBLIC_ADMIN_PASSWORD`.

Desde ahí puedes:
- Ver todos los RSVPs y cuántos invitados confirman
- Aprobar o rechazar mensajes del muro antes de que aparezcan públicamente
- Ver estadísticas en tiempo real

Para moderar mensajes en Firestore directamente: **Firebase Console → Firestore → colección `messages`** y cambia `approved: false → true`.

---

## 🔒 Seguridad

- Las reglas de Firestore limitan lo que los usuarios pueden leer/escribir
- Los RSVPs solo se pueden crear (no leer) desde el cliente — solo desde Firebase Console
- Los mensajes requieren aprobación antes de aparecer en el muro público
- La contraseña del admin es del lado del cliente (suficiente para una invitación privada)

---

## 💡 Ideas para expandir

- [ ] Foto de la cumpleañera en el hero con efecto parallax
- [ ] Playlist de Spotify embebida
- [ ] Galería de fotos / memorias
- [ ] Dress code con moodboard
- [ ] Notificaciones por email al confirmar (via Firebase Functions + SendGrid)
- [ ] Mapa interactivo con instrucciones de llegada
- [ ] Compartir en WhatsApp con preview OG
