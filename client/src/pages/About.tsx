import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Separator from "@/components/Separator";

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export default function AboutPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const repoOwner = "kom-senapati";
        const repoName = "bot-verse";
        const response = await axios.get(
          `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`
        );
        setContributors(response.data);
      } catch (error) {
        console.error("Error fetching contributors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">About Bot Verse</h1>
        <p className="text-center max-w-2xl mx-auto text-muted-foreground mb-8">
          Bot Verse is a platform designed to provide an enhanced user
          experience through a series of "Magic Tools." From OCR and translation
          to text-to-speech, Bot Verse enables users to interact with AI-powered
          tools in an intuitive way.
        </p>
        <Separator />

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Meet the Contributors</h2>
          <Separator />

          {loading ? (
            <p>Loading contributors...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {contributors.map((contributor) => (
                <>
                  <Card key={contributor.login}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-center">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={contributor.avatar_url} />
                          <AvatarFallback>
                            {contributor.login.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </CardTitle>
                      <CardDescription>
                        <p className="text-xl">{contributor.login}</p>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="p-4 text-medium mb-2">
                        {contributor.contributions} contributions
                      </Badge>
                    </CardContent>
                    <CardFooter>
                      <Button variant={"outline"} className="w-full">
                        <Link
                          to={contributor.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Profile
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              ))}
            </div>
          )}
        </section>
      </div>
      <Separator />
      <Footer />
    </>
  );
}
