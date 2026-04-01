insert into public.businesses (
  id,
  name,
  slug,
  owner_name,
  owner_email,
  primary_color,
  secondary_color,
  accent_color,
  welcome_text
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Casa Luma',
    'casa-luma',
    'Lucia Romero',
    'lucia@casaluma.com',
    '#163B33',
    '#F7F2E8',
    '#C8873F',
    'Tu club de fidelización para cenas memorables.'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Brasa Norte',
    'brasa-norte',
    'Jorge Vidal',
    'jorge@brasanorte.com',
    '#23211F',
    '#F6F1EA',
    '#C55A11',
    'Puntos, premios y experiencias para clientes recurrentes.'
  )
on conflict (id) do nothing;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'rewards'
      and column_name = 'restaurant_id'
  ) then
    execute $sql$
      insert into public.rewards (
        business_id,
        restaurant_id,
        title,
        description,
        reward_type,
        points_required,
        starts_at,
        ends_at
      )
      values
        (
          '11111111-1111-1111-1111-111111111111',
          '11111111-1111-1111-1111-111111111111',
          'Copa de bienvenida',
          'Una copa de vino de la casa en tu próxima visita.',
          'standard',
          20,
          now(),
          now() + interval '12 months'
        ),
        (
          '11111111-1111-1111-1111-111111111111',
          '11111111-1111-1111-1111-111111111111',
          'Postre artesanal',
          'Elige uno de los postres del menú degustación.',
          'special',
          45,
          now(),
          now() + interval '12 months'
        ),
        (
          '22222222-2222-2222-2222-222222222222',
          '22222222-2222-2222-2222-222222222222',
          'Upgrade a menú premium',
          'Mejora tu menú con una selección premium.',
          'bonus',
          60,
          now(),
          now() + interval '12 months'
        )
    $sql$;
  else
    insert into public.rewards (
      business_id,
      title,
      description,
      reward_type,
      points_required,
      starts_at,
      ends_at
    )
    values
      (
        '11111111-1111-1111-1111-111111111111',
        'Copa de bienvenida',
        'Una copa de vino de la casa en tu próxima visita.',
        'standard',
        20,
        now(),
        now() + interval '12 months'
      ),
      (
        '11111111-1111-1111-1111-111111111111',
        'Postre artesanal',
        'Elige uno de los postres del menú degustación.',
        'special',
        45,
        now(),
        now() + interval '12 months'
      ),
      (
        '22222222-2222-2222-2222-222222222222',
        'Upgrade a menú premium',
        'Mejora tu menú con una selección premium.',
        'bonus',
        60,
        now(),
        now() + interval '12 months'
      );
  end if;
end $$;
