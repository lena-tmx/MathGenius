import Link from "next/link";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const nextPath = typeof params?.next === "string" ? params.next : "/dashboard";

  return (
    <div className="section-heading section-block">
      <span className="eyebrow">Account</span>
      <h1>Login page is coming next</h1>
      <p>
        Protected dashboard routes redirect here. Full cookie-based login will be added in the auth UI PR.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24 }}>
        <Link className="btn-primary" href="/">Back home</Link>
        <Link className="btn-secondary" href={nextPath}>Try dashboard again</Link>
      </div>
    </div>
  );
}
