# Advisor photos

No advisor photos exist yet — every card currently shows initials on a gradient background (`.team-photo` in `assets/css/style.css`).

To add a photo for an advisor:

1. Crop the photo to a **4:5 portrait** ratio (matches the existing `.team-photo` box — a square photo will be cropped by the browser via `object-fit: cover`, so square source images work fine too, they'll just fill a portrait frame).
2. Save it here as `<advisor-id>.jpg` (or `.png`/`.webp`), where `<advisor-id>` matches the `id` field in [`/data/advisors.json`](../../../data/advisors.json), e.g. `dave-allred-executive.jpg`.
3. In `advisors.json`, set that advisor's `"photo"` field to `"assets/images/advisors/<file>"`.

No code changes needed — `assets/js/content.js` automatically renders an `<img>` in place of the initials once `photo` is set.
