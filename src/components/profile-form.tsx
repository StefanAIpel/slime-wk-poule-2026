import { saveProfile } from "@/app/actions";

export function ProfileForm() {
  return (
    <form action={saveProfile} className="panel grid gap-3 p-4">
      <div>
        <h2 className="text-2xl font-black text-[#081634]">Bijna klaar</h2>
        <p className="mt-1 text-sm font-semibold text-[#48617f]">Nog twee velden, meer vragen we niet.</p>
      </div>
      <label className="grid gap-2 text-sm font-black text-[#081634]">
        Bijnaam
        <input className="field" name="nickname" required minLength={2} maxLength={40} placeholder="Stefan" />
      </label>
      <label className="grid gap-2 text-sm font-black text-[#081634]">
        Teamnaam
        <input className="field" name="team_name" required minLength={2} maxLength={40} placeholder="VARschrikkelijk goed" />
      </label>
      <button className="button-primary" type="submit">
        Start mijn poule
      </button>
    </form>
  );
}
