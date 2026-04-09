// Prisma removed: provide a small in-memory stub implementing the minimal
// `prisma.user` methods used by the app so the project can run without Prisma.

type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
};

const users: User[] = [];

const inMemoryPrisma: any = {
  user: {
    count: async () => users.length,
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      if (where.email) return users.find((u) => u.email === where.email) ?? null;
      if (where.id) return users.find((u) => u.id === where.id) ?? null;
      return null;
    },
    create: async ({ data }: { data: Partial<User> }) => {
      const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const newUser: User = {
        id,
        name: (data.name as string) || "",
        email: (data.email as string) || "",
        password: (data.password as string) || undefined,
      };
      users.push(newUser);
      return newUser;
    },
  },
};

export default inMemoryPrisma;
