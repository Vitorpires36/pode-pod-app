/*
  # Inserir vendas do cliente - Fevereiro 2026
  
  Script para inserir todas as vendas listadas no período de 02/02 a 13/02
  Cada venda inclui: cliente, produtos, valores, datas, custos operacionais
*/

-- 02/02/2026 - Tiago: 1 ELF 45K + frete 35 = 169,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Tiago',
  '2026-02-02',
  '{"name": "Tiago", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "ELF 45K", "price": 129.90, "quantity": 1, "brand": "Elf Bar"}]',
  169.90,
  35.00,
  31.97,
  'completed',
  'Frete cobrado: R$ 35,00, custo: R$ 31,97',
  NOW()
);

-- 02/02/2026 - Emerson: 2 ELF 45K + frete 22 = 291,80
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Emerson',
  '2026-02-02',
  '{"name": "Emerson", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "ELF 45K", "price": 129.90, "quantity": 2, "brand": "Elf Bar"}]',
  291.80,
  22.00,
  5.50,
  'completed',
  'Frete cobrado: R$ 22,00, custo: R$ 5,50 (boa margem)',
  NOW()
);

-- 02/02/2026 - Rafael: 1 ELF 30K + frete 32 = 136,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Rafael',
  '2026-02-02',
  '{"name": "Rafael", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "ELF 30K", "price": 104.90, "quantity": 1, "brand": "Elf Bar"}]',
  136.90,
  32.00,
  25.37,
  'completed',
  'Frete cobrado: R$ 32,00, custo: R$ 25,37',
  NOW()
);

-- 02/02/2026 - Leonardo: 1 V55 + frete 15 = 124,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Leonardo',
  '2026-02-02',
  '{"name": "Leonardo", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "V55", "price": 109.90, "quantity": 1, "brand": "Vape"}]',
  124.90,
  15.00,
  16.89,
  'completed',
  'Frete cobrado: R$ 15,00, custo: R$ 16,89 (pequena perda)',
  NOW()
);

-- 03/02/2026 - Gabriel: 3 ELF 45K + frete 40 = 444,70
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Gabriel',
  '2026-02-03',
  '{"name": "Gabriel", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "ELF 45K", "price": 129.90, "quantity": 3, "brand": "Elf Bar"}]',
  444.70,
  40.00,
  30.98,
  'completed',
  'Frete cobrado: R$ 40,00, custo: R$ 30,98',
  NOW()
);

-- 03/02/2026 - Marisa: 2 V250 (109,90 + 45) + frete 15 = 169,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Marisa',
  '2026-02-03',
  '{"name": "Marisa", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "V250", "price": 109.90, "quantity": 1, "brand": "Vape"}, {"name": "V250", "price": 45.00, "quantity": 1, "brand": "Vape"}]',
  169.90,
  15.00,
  16.79,
  'completed',
  'Frete cobrado: R$ 15,00, custo: R$ 16,79',
  NOW()
);

-- 03/02/2026 - Paula: 1 ELF 45K + frete 15 = 149,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Paula',
  '2026-02-03',
  '{"name": "Paula", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "ELF 45K", "price": 129.90, "quantity": 1, "brand": "Elf Bar"}]',
  149.90,
  15.00,
  7.39,
  'completed',
  'Frete cobrado: R$ 15,00, custo: R$ 7,39 (ótima margem)',
  NOW()
);

-- 04/02/2026 - Giovana: 1 V155 slim + frete 20 = 104,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Giovana',
  '2026-02-04',
  '{"name": "Giovana", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "V155 Slim", "price": 84.90, "quantity": 1, "brand": "Vape"}]',
  104.90,
  20.00,
  18.23,
  'completed',
  'Frete cobrado: R$ 20,00, custo: R$ 18,23',
  NOW()
);

-- 05/02/2026 - Fernando: 2 V250 + frete 25 = 244,80
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Fernando',
  '2026-02-05',
  '{"name": "Fernando", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "V250", "price": 109.90, "quantity": 2, "brand": "Vape"}]',
  244.80,
  25.00,
  18.07,
  'completed',
  'Frete cobrado: R$ 25,00, custo: R$ 18,07',
  NOW()
);

-- 05/02/2026 - Andreta: 1 V55 Slim + 1 ELF 23K + frete 24 = 203,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Andreta',
  '2026-02-05',
  '{"name": "Andreta", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "V55 Slim", "price": 84.90, "quantity": 1, "brand": "Vape"}, {"name": "ELF 23K", "price": 94.90, "quantity": 1, "brand": "Elf Bar"}]',
  203.90,
  24.00,
  5.39,
  'completed',
  'Frete cobrado: R$ 24,00, custo: R$ 5,39 (excelente margem)',
  NOW()
);

-- 06/02/2026 - Li: 1 LOST DURA + frete 15 = 114,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Li',
  '2026-02-06',
  '{"name": "Li", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "LOST DURA", "price": 99.90, "quantity": 1, "brand": "Lost"}]',
  114.90,
  15.00,
  9.66,
  'completed',
  'Frete cobrado: R$ 15,00, custo: R$ 9,66',
  NOW()
);

-- 06/02/2026 - Bruna: 1 V400 + frete 30 = 159,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Bruna',
  '2026-02-06',
  '{"name": "Bruna", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "V400", "price": 129.90, "quantity": 1, "brand": "Vape"}]',
  159.90,
  30.00,
  16.77,
  'completed',
  'Frete cobrado: R$ 30,00, custo: R$ 16,77',
  NOW()
);

-- 10/02/2026 - Catarina: 1 V55 Slim 84,90 + frete 27,20 = 112,10
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Catarina',
  '2026-02-10',
  '{"name": "Catarina", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "V55 Slim", "price": 84.90, "quantity": 1, "brand": "Vape"}]',
  112.10,
  27.20,
  10.82,
  'completed',
  'Frete cobrado: R$ 27,20, custo: R$ 10,82',
  NOW()
);

-- 11/02/2026 - Rafaela: 1 ELF 40K 119,90 + frete 30 = 149,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Rafaela',
  '2026-02-11',
  '{"name": "Rafaela", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "ELF 40K", "price": 119.90, "quantity": 1, "brand": "Elf Bar"}]',
  149.90,
  30.00,
  13.55,
  'completed',
  'Frete cobrado: R$ 30,00, custo: R$ 13,55',
  NOW()
);

-- 12/02/2026 - João: 1 V80 89,90 + frete 20 = 109,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'João',
  '2026-02-12',
  '{"name": "João", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "V80", "price": 89.90, "quantity": 1, "brand": "Vape"}]',
  109.90,
  20.00,
  12.81,
  'completed',
  'Frete cobrado: R$ 20,00, custo: R$ 12,81',
  NOW()
);

-- 12/02/2026 - Paula: 1 ELF 40K TRIO 119,90 + frete 25 = 144,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Paula',
  '2026-02-12',
  '{"name": "Paula", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "ELF 40K TRIO", "price": 119.90, "quantity": 1, "brand": "Elf Bar"}]',
  144.90,
  25.00,
  25.90,
  'completed',
  'Frete cobrado: R$ 25,00, custo: R$ 25,90 (pequena perda)',
  NOW()
);

-- 12/02/2026 - Lilian: 1 ELF 45K 129,90 + frete 10 = 139,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Lilian',
  '2026-02-12',
  '{"name": "Lilian", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "ELF 45K", "price": 129.90, "quantity": 1, "brand": "Elf Bar"}]',
  139.90,
  10.00,
  0.31,
  'completed',
  'Frete cobrado: R$ 10,00, lucro excelente de R$ 9,69 no frete',
  NOW()
);

-- 12/02/2026 - Ivana: 1 V400 129,90 + frete 15 = 144,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Ivana',
  '2026-02-12',
  '{"name": "Ivana", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "V400", "price": 129.90, "quantity": 1, "brand": "Vape"}]',
  144.90,
  15.00,
  11.93,
  'completed',
  'Frete cobrado: R$ 15,00, custo: R$ 11,93',
  NOW()
);

-- 12/02/2026 - Gabriel: 1 ELF 9K 94,90 + frete 20 = 114,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Gabriel',
  '2026-02-12',
  '{"name": "Gabriel", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "ELF 9K", "price": 94.90, "quantity": 1, "brand": "Elf Bar"}]',
  114.90,
  20.00,
  12.12,
  'completed',
  'Frete cobrado: R$ 20,00, custo: R$ 12,12',
  NOW()
);

-- 13/02/2026 - Taina: 1 ELF 40K Ice King 119,90 + frete 35,60 = 155,50
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Taina',
  '2026-02-13',
  '{"name": "Taina", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "ELF 40K Ice King", "price": 119.90, "quantity": 1, "brand": "Elf Bar"}]',
  155.50,
  35.60,
  24.73,
  'completed',
  'Frete cobrado: R$ 35,60, custo: R$ 24,73',
  NOW()
);

-- 13/02/2026 - Leo: 1 ELF 9K 74,90 + frete 15 = 94,90
INSERT INTO orders (customer_name, sale_date, customer, items, total, frete_cobrado, frete_custo, status, observacoes, created_at)
VALUES (
  'Leo',
  '2026-02-13',
  '{"name": "Leo", "phone": "", "endereco": "", "bairro": ""}',
  '[{"name": "ELF 9K", "price": 74.90, "quantity": 1, "brand": "Elf Bar"}]',
  94.90,
  15.00,
  20.00,
  'completed',
  'Frete cobrado: R$ 15,00, custo: R$ 20,00 (perda de R$ 5,00 no frete)',
  NOW()
);

-- Verificar dados inseridos
SELECT COUNT(*) as total_vendas, SUM(total) as faturamento_total, AVG(total) as ticket_medio
FROM orders 
WHERE sale_date BETWEEN '2026-02-02' AND '2026-02-13';
