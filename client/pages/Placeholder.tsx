import Layout from "@/components/Layout";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderProps {
  title: string;
  description: string;
  features?: string[];
}

export default function Placeholder({ title, description, features }: PlaceholderProps) {
  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-theme(spacing.20))] items-center justify-center px-4">
        <div className="max-w-2xl space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">{title}</h1>
            <p className="text-xl text-muted-foreground">{description}</p>
          </div>

          {features && features.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">
                This section will include:
              </p>
              <ul className="inline-block space-y-2 text-left">
                {features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-8">
            <p className="mb-6 text-sm text-muted-foreground">
              Continue building this feature by prompting the assistant to fill in the details.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Back to Home
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
