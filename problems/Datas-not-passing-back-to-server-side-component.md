# State/Props Not Passing Back to Server-Side Component

>[!NOTE]
>### Description:
> Unable to pass state or props from a client-side component back to a server-side component.

### Cause:
In Next.js, data flows naturally from Server Components to Client Components via props. However, passing data from Client Components back to Server Components isn't straightforward due to the separation between server and client environments.
To address this, Next.js introduced Server Actions in version 13.4 (currently in alpha). Server Actions allow you to define server-side functions that can be invoked from Client Components, facilitating data flow from the client to the server.

Here's how you can document this in your error log:
- Server components are designed to fetch data during SSR or SSG, and their state is determined during the initial render.
- Client components run in the browser and cannot directly share state back with server components due to the separation of execution contexts.

### Solution:
1. Use API Routes:
- Create an API route to send data from the client to the server.
- Example:
```javascript
// /pages/api/update-data.js
export default async function handler(req, res) {
  const { data } = req.body;
  // Process data and save it to a database
  res.status(200).json({ success: true });
}
```
- Call this API route from the client-side component using fetch or axios.

2. Use Server Actions (Experimental):
- Utilize experimental features in Next.js for server-side actions to enable this communication.

3. Lift State Up:
- Manage shared state in a parent client-side component and pass it down as needed.
4. Hydration:
  - Serialize server-side data using JSON.stringify and send it to the client as props.

### Key Takeaways:
- Server components are stateless and cannot receive dynamic state updates from client components.
- Always plan data flow between server and client components during architecture design.
### Example Code:
```javascript
// Server Component
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

export default function ServerComponent({ data }) {
  return <ClientComponent data={data} />;
}

// Client Component
function ClientComponent({ data }) {
  const [clientData, setClientData] = useState(data);

  const updateData = async () => {
    const response = await fetch('/api/update-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: clientData }),
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <button onClick={updateData}>
      Update Server
    </button>
  );
}
```
### Date Encountered:  Nov 12, 2024
