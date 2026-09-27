import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return <div className="not-found-page"><div className="not-found-card"><span className="brand-mark">⚡</span><h1>404</h1><h2>Essa página saiu para sacar.</h2><p>O endereço não existe ou foi movido.</p><Link to="/" className="primary-link">Voltar para a Arena</Link></div></div>;
}
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error); const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return <div className="not-found-page"><div className="not-found-card"><span className="brand-mark">⚡</span><h2>O jogo travou.</h2><p>Algo inesperado aconteceu. Tente novamente.</p><button className="primary-link" onClick={() => { router.invalidate(); reset(); }}>Tentar novamente</button></div></div>;
}
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({ meta: [
    { charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" },
    { title: "Arena Vôlei — reserve sua quadra" },
    { name: "description", content: "Encontre quadras, veja horários e reserve seu próximo jogo na Arena Vôlei." },
    { name: "theme-color", content: "#f05a28" },
    { property: "og:title", content: "Arena Vôlei — reserve sua quadra" },
    { property: "og:description", content: "Quadras, horários e reservas em um só lugar." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "stylesheet", href: appCss }, { rel: "icon", href: "/favicon.ico", type: "image/x-icon" }] }),
  shellComponent: ({ children }: { children: ReactNode }) => <html lang="pt-BR"><head><HeadContent /></head><body>{children}<Scripts /></body></html>,
  component: () => { const { queryClient } = Route.useRouteContext(); return <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>; },
  notFoundComponent: NotFoundComponent, errorComponent: ErrorComponent,
});
