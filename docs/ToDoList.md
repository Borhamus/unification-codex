# Balance Tool — Checklist de mejoras

## 🎨 UI / Visual
- [ ] Fuentes más grandes y con mejor contraste (mínimo 14px para texto principal)
- [ ] Modo oscuro / claro con switch en el header
- [ ] Ícono del item seleccionado más grande (60×60 mínimo en el detail panel)
- [ ] Lista de unidades con más espacio entre items (padding mayor)
- [ ] Header con nombre del proyecto y navegación entre módulos
- [ ] Responsive — que funcione en pantallas más chicas
- [ ] Colores de categoría más consistentes y visibles

## 📊 Información por unidad (referencia: wiki.dawn-of-war.pro)
- [ ] Tipo de armadura (type_armour) mostrado con ícono
- [ ] Morale / morale_death visible
- [ ] Tabla de efectividad vs tipos de unidad (Infantry Low/Med/High, Vehicle, Building)
- [ ] Descripción de la unidad (texto lore/gameplay — generar con IA)
- [ ] Requisitos de construcción (qué edificio se necesita)
- [ ] Tier de la unidad (T1/T2/T3/T4)

## ⚔️ Armas
- [ ] Lista de armas que usa la unidad con sus stats completos
- [ ] DPS calculado (damage / reload_time × accuracy)
- [ ] Tipo de daño (melee, ranged, bolter, plasma, etc.)
- [ ] Efectividad por tipo de objetivo

## 🔬 Research / Upgrades
- [ ] Lista de investigaciones que afectan la unidad
- [ ] Mostrar delta de stats al aplicar cada research (HP 800 → 920)
- [ ] Switch visual para "simular con upgrade aplicado" y ver cómo cambia la unidad

## 🔄 Comparación
- [ ] Comparar dos unidades side by side con deltas resaltados
- [ ] Comparar con promedio de la facción
- [ ] Comparar con promedio del mod (cross-faction)

## 📈 Power Budget
- [ ] Score explicado en lenguaje simple para cada eje
- [ ] Radar chart de la facción (Combat / Mobility / Economy / Utility)
- [ ] Balance delta visible cuando haya match data

## 🏛️ Facción
- [ ] Sub-facciones de Death Guard (Company of Nurgle, Pestilence, etc.)
- [ ] Vista de grilla con íconos (como el mockup original)
- [ ] Filtro por tier (T1/T2/T3/T4)
- [ ] Stats promedio de la facción vs otras facciones

## 🗃️ Datos
- [ ] Todas las facciones procesadas y subidas (actualmente: Death Guard, 13th Company, Tyranids)
- [ ] Íconos de todas las facciones subidos al Storage
- [ ] Descripciones generadas con IA para todas las unidades
- [ ] Research conectado a las unidades que afecta

## 🌐 General
- [ ] URL amigable por unidad (/balance/death_guard/plague_marine)
- [ ] Buscador global que busque en todas las facciones
- [ ] Página de inicio con overview de todas las facciones
- [ ] Deploy en Vercel (actualmente solo localhost)

---

## Prioridades inmediatas (próxima sesión)

1. **Tamaño de fuentes y contraste** — impacto visual inmediato
2. **Modo oscuro/claro** — muy pedido en comunidades de gaming
3. **Ícono grande en el panel de detalle**
4. **Research que afecta la unidad con preview de cambio**
5. **Deploy en Vercel** — para poder compartir con la comunidad

---

## Referencias
- Wiki: https://wiki.dawn-of-war.pro/mod/5
- SSStats2: https://github.com/dubinaxdd/SSStats2
- Fandom wiki: https://dawn-of-war-unification-mod.fandom.com/wiki/Races