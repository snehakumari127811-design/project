import * as jose from 'jose';

/**
 * Viral Raja Backend - Cloudflare Worker
 */

export interface Env {
	DB: D1Database;
	FIREBASE_PROJECT_ID: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;
		const method = request.method;

		// CORS setup
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		};

		if (method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		try {
			// --- PUBLIC ROUTES ---

			// GET /api/videos
			if (path === '/api/videos' && method === 'GET') {
				const category = url.searchParams.get('category');
				const search = url.searchParams.get('search');
				
				let query = 'SELECT * FROM videos';
				const params: any[] = [];

				if (category || search) {
					query += ' WHERE';
					const conditions: string[] = [];
					if (category) {
						conditions.push(' category_id = ?');
						params.push(category);
					}
					if (search) {
						conditions.push(' (title LIKE ? OR description LIKE ?)');
						params.push(`%${search}%`, `%${search}%`);
					}
					query += conditions.join(' AND');
				}
				
				query += ' ORDER BY created_at DESC';
				const { results } = await env.DB.prepare(query).bind(...params).all();
				return Response.json(results, { headers: corsHeaders });
			}

			// GET /api/videos/:id
			if (path.startsWith('/api/videos/') && method === 'GET') {
				const id = path.split('/').pop();
				const result = await env.DB.prepare('SELECT * FROM videos WHERE id = ?').bind(id).first();
				if (!result) return new Response('Not Found', { status: 404, headers: corsHeaders });
				return Response.json(result, { headers: corsHeaders });
			}

			// POST /api/videos/:id/view
			if (path.startsWith('/api/videos/') && path.endsWith('/view') && method === 'POST') {
				const id = path.split('/')[3];
				await env.DB.prepare('UPDATE videos SET views = views + 1 WHERE id = ?').bind(id).run();
				return new Response('OK', { headers: corsHeaders });
			}

			// GET /api/videos/:id/comments
			if (path.startsWith('/api/videos/') && path.endsWith('/comments') && method === 'GET') {
				const id = path.split('/')[3];
				const { results } = await env.DB.prepare('SELECT * FROM comments WHERE video_id = ? AND is_moderated = 0 ORDER BY created_at DESC').bind(id).all();
				return Response.json(results, { headers: corsHeaders });
			}

			// GET /api/videos/:id/likes
			if (path.startsWith('/api/videos/') && path.endsWith('/likes') && method === 'GET') {
				const id = path.split('/')[3];
				const { results } = await env.DB.prepare('SELECT * FROM likes WHERE video_id = ?').bind(id).all();
				return Response.json(results, { headers: corsHeaders });
			}

			// GET /api/categories
			if (path === '/api/categories' && method === 'GET') {
				const { results } = await env.DB.prepare('SELECT * FROM categories ORDER BY name ASC').all();
				return Response.json(results, { headers: corsHeaders });
			}

			// POST /api/likes
			if (path === '/api/likes' && method === 'POST') {
				const { video_id, ip_address } = await request.json() as any;
				const id = crypto.randomUUID();
				await env.DB.prepare('INSERT INTO likes (id, video_id, ip_address) VALUES (?, ?, ?)')
					.bind(id, video_id, ip_address).run();
				return Response.json({ id }, { status: 201, headers: corsHeaders });
			}

			// POST /api/comments
			if (path === '/api/comments' && method === 'POST') {
				const { video_id, commenter_name, content } = await request.json() as any;
				const id = crypto.randomUUID();
				await env.DB.prepare('INSERT INTO comments (id, video_id, commenter_name, content) VALUES (?, ?, ?, ?)')
					.bind(id, video_id, commenter_name, content).run();
				return Response.json({ id }, { status: 201, headers: corsHeaders });
			}

			// --- ADMIN ROUTES (Placeholder Protection) ---
			
			// --- ADMIN ROUTES Protection ---
			
			const authHeader = request.headers.get('Authorization');
			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				return new Response('Unauthorized: Missing Token', { status: 401, headers: corsHeaders });
			}

			const token = authHeader.split(' ')[1];
			const projectId = env.FIREBASE_PROJECT_ID;

			try {
				// Verify the Firebase ID Token
				const JWKS = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
				
				const { payload } = await jose.jwtVerify(token, JWKS, {
					issuer: `https://securetoken.google.com/${projectId}`,
					audience: projectId,
				});

				// Token is valid! Proceed to admin routes.
				// (Payload contains user info if needed, e.g., payload.sub is the UID)
			} catch (err: any) {
				console.error('Token verification failed:', err.message);
				return new Response(`Unauthorized: Invalid Token - ${err.message}`, { status: 401, headers: corsHeaders });
			}

			// GET /api/admin/stats
			if (path === '/api/admin/stats' && method === 'GET') {
				const videos = await env.DB.prepare('SELECT COUNT(*) as count, SUM(views) as total_views FROM videos').first();
				const likes = await env.DB.prepare('SELECT COUNT(*) as count FROM likes').first();
				const comments = await env.DB.prepare('SELECT COUNT(*) as count FROM comments').first();
				const reports = await env.DB.prepare('SELECT COUNT(*) as count FROM reports WHERE status = "pending"').first();

				return Response.json({
					totalVideos: videos?.count || 0,
					totalViews: videos?.total_views || 0,
					totalLikes: likes?.count || 0,
					totalComments: comments?.count || 0,
					pendingReports: reports?.count || 0,
				}, { headers: corsHeaders });
			}

			// POST /api/videos
			if (path === '/api/videos' && method === 'POST') {
				const data = await request.json() as any;
				const id = crypto.randomUUID();
				await env.DB.prepare('INSERT INTO videos (id, title, description, category_id, video_url, thumbnail_url, duration) VALUES (?, ?, ?, ?, ?, ?, ?)')
					.bind(id, data.title, data.description, data.category_id, data.video_url, data.thumbnail_url, data.duration).run();
				return Response.json({ id }, { status: 201, headers: corsHeaders });
			}

			// DELETE /api/videos/:id
			if (path.startsWith('/api/videos/') && method === 'DELETE') {
				const id = path.split('/').pop();
				await env.DB.prepare('DELETE FROM videos WHERE id = ?').bind(id).run();
				return new Response('Deleted', { headers: corsHeaders });
			}

			// --- MODERATION ENDPOINTS ---

			// GET /api/admin/comments
			if (path === '/api/admin/comments' && method === 'GET') {
				const { results } = await env.DB.prepare('SELECT * FROM comments ORDER BY created_at DESC').all();
				return Response.json(results, { headers: corsHeaders });
			}

			// DELETE /api/admin/comments/:id
			if (path.startsWith('/api/admin/comments/') && method === 'DELETE') {
				const id = path.split('/')[4];
				await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
				return new Response('Deleted', { headers: corsHeaders });
			}

			// POST /api/admin/comments/:id/moderate
			if (path.startsWith('/api/admin/comments/') && path.endsWith('/moderate') && method === 'POST') {
				const id = path.split('/')[4];
				await env.DB.prepare('UPDATE comments SET is_moderated = 1 WHERE id = ?').bind(id).run();
				return new Response('Moderated', { headers: corsHeaders });
			}

			// GET /api/admin/reports
			if (path === '/api/admin/reports' && method === 'GET') {
				const { results } = await env.DB.prepare('SELECT * FROM reports ORDER BY created_at DESC').all();
				return Response.json(results, { headers: corsHeaders });
			}

			// POST /api/admin/reports/:id/status
			if (path.startsWith('/api/admin/reports/') && path.endsWith('/status') && method === 'POST') {
				const id = path.split('/')[4];
				const { status } = await request.json() as any;
				await env.DB.prepare('UPDATE reports SET status = ?, reviewed_at = datetime("now") WHERE id = ?').bind(status, id).run();
				return new Response('Status Updated', { headers: corsHeaders });
			}

			return new Response('Not Found', { status: 404, headers: corsHeaders });

		} catch (err: any) {
			return new Response(err.message || 'Internal Server Error', { status: 500, headers: corsHeaders });
		}
	},
};
