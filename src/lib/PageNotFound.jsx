import { useLocation, Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function PageNotFound({}) {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    {/* 404 Error Code */}
                    <div className="space-y-2">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-3xl bg-card border border-border flex items-center justify-center">
                                <SearchX className="w-10 h-10 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-7xl font-black teal-text">404</h1>
                        <div className="h-0.5 w-16 teal-gradient mx-auto rounded-full" />
                    </div>

                    {/* Main Message */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-foreground">
                            Page Not Found
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            The page <span className="font-medium text-foreground">"{pageName}"</span> could not be found in this application.
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-6">
                        <Link
                            to={createPageUrl("Home")}
                            className="btn-primary inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
